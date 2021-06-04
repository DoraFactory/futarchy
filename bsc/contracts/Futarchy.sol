pragma solidity >=0.6.0 <=0.8.3;
pragma experimental ABIEncoderV2;

contract FutArchy {
    struct Vote {
        address userAddr;
        uint256 amount;
        bool answer;
    }

    enum DebateStatus {DEBATE, VOTE, COMPLETED}

    struct Debate {
        uint256 id;
        string description;
        uint256 userLimit;
        uint256 userCount;
        DebateStatus status;
        uint256 fee; // Service fee in percent.
        uint256 maxVoteCap;
        uint256 minVoteCap;
        uint256 totalVoteCount;
        uint256 yesVoteCount;
        uint256 noVoteCount;
        uint256 yesAmount;
        uint256 noAmount;
    }

    address public owner;
    uint256 public ownerBalance;
    mapping(address => bool) public admins;
    mapping(address => uint256) public balances;
    mapping(uint256 => Vote[]) private votes;
    mapping(uint256 => mapping(address => bool)) private allowedUsers;
    mapping(uint256 => mapping(address => bool)) private contributedUsers;
    Debate[] private debates;

    event VoteEvent(address indexed _from, uint256 indexed _debateId);

    constructor() public {
        owner = msg.sender;
        ownerBalance = 0;
    }

    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }

    modifier restricted() {
        require(msg.sender == owner || admins[msg.sender]);
        _;
    }

    function claimOwnerBalance() external payable restricted {
        msg.sender.transfer(ownerBalance);
        ownerBalance = 0;
    }

    function changeOwner(address addr) public ownerOnly {
        owner = addr;
    }

    function addAdmin(address addr) public ownerOnly {
        admins[addr] = true;
    }

    function removeAdmin(address addr) public ownerOnly {
        admins[addr] = false;
    }

    function createDebate(string memory description, uint256 userLimit)
        external
        restricted
    {
        Debate memory newDebate;
        newDebate.id = debates.length;
        newDebate.description = description;
        newDebate.userLimit = userLimit;
        newDebate.userCount = 0;
        newDebate.status = DebateStatus.DEBATE;
        debates.push(newDebate);
    }

    function whitelistUser(uint256 index, address addr) external restricted {
        require(index < debates.length);

        Debate storage debate = debates[index];

        require(debate.status == DebateStatus.DEBATE);
        require(debate.userCount < debate.userLimit);
        require(!allowedUsers[index][addr]);

        allowedUsers[index][addr] = true;
        debate.userCount++;
    }

    function startVote(
        uint256 index,
        uint256 maxVoteCap,
        uint256 minVoteCap,
        uint256 fee
    ) external restricted {
        require(index < debates.length);
        require(maxVoteCap > 0);
        require(minVoteCap > 0);
        require(fee < 100);

        Debate storage debate = debates[index];

        require(debate.status == DebateStatus.DEBATE);

        debate.fee = fee;
        debate.maxVoteCap = maxVoteCap;
        debate.minVoteCap = minVoteCap;
        debate.totalVoteCount = 0;
        debate.yesVoteCount = 0;
        debate.noVoteCount = 0;
        debate.yesAmount = 0;
        debate.noAmount = 0;
        debate.status = DebateStatus.VOTE;
    }

    function voteDebate(uint256 index, bool answer) external payable {
        require(index < debates.length);

        Debate storage debate = debates[index];

        require(debate.status == DebateStatus.VOTE);
        require(allowedUsers[index][msg.sender]);
        require(!contributedUsers[index][msg.sender]);
        require(msg.value >= debate.minVoteCap);
        require(msg.value <= debate.maxVoteCap);

        Vote memory newVote =
            Vote({userAddr: msg.sender, amount: msg.value, answer: answer});
        votes[index].push(newVote);

        contributedUsers[index][msg.sender] = true;
        debate.totalVoteCount++;

        if (answer) {
            debate.yesAmount += msg.value;
            debate.yesVoteCount++;
        } else {
            debate.noAmount += msg.value;
            debate.noVoteCount++;
        }

        emit VoteEvent(msg.sender, index);
    }

    function completeDebate(uint256 index) external restricted {
        require(index < debates.length);

        Debate storage debate = debates[index];

        require(debate.status == DebateStatus.VOTE);

        debate.status = DebateStatus.COMPLETED;

        uint256 totalAmount = debate.yesAmount + debate.noAmount;
        uint256 rewardAmount;

        ownerBalance += (totalAmount * debate.fee) / 100;

        for (uint256 i = 0; i < votes[index].length; i++) {
            Vote storage vote = votes[index][i];
            rewardAmount = 0;

            if (debate.yesAmount > debate.noAmount) {
                if (vote.answer) {
                    rewardAmount =
                        (vote.amount * totalAmount) /
                        debate.yesAmount;
                }
            } else if (debate.yesAmount < debate.noAmount) {
                if (!vote.answer) {
                    rewardAmount =
                        (vote.amount * totalAmount) /
                        debate.noAmount;
                }
            } else {
                rewardAmount = vote.amount;
            }

            if (rewardAmount > 0) {
                balances[vote.userAddr] +=
                    (rewardAmount * (100 - debate.fee)) /
                    100;
            }
        }
    }

    function claimBalance() external payable {
        require(balances[msg.sender] > 0);

        msg.sender.transfer(balances[msg.sender]);
        balances[msg.sender] = 0;
    }

    function getDebateCount() external view returns (uint256) {
        return debates.length;
    }

    function getDebateList(address addr)
        external
        view
        returns (Debate[] memory)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < debates.length; i++) {
            if (addr == owner || admins[addr] || allowedUsers[i][addr]) {
                count++;
            }
        }

        Debate[] memory debateList = new Debate[](count);

        count = 0;
        for (uint256 i = 0; i < debates.length; i++) {
            if (addr == owner || admins[addr] || allowedUsers[i][addr]) {
                Debate memory item;
                item.id = debates[i].id;
                item.description = debates[i].description;
                item.userLimit = debates[i].userLimit;
                item.userCount = debates[i].userCount;
                item.status = debates[i].status;
                item.fee = debates[i].fee;
                item.maxVoteCap = debates[i].maxVoteCap;
                item.minVoteCap = debates[i].minVoteCap;
                debateList[count] = item;
                count++;
            }
        }

        return debateList;
    }

    function getDebateDetail(uint256 index, address addr)
        external
        view
        returns (Debate memory)
    {
        require(index < debates.length);
        require(addr == owner || admins[addr] || allowedUsers[index][addr]);

        Debate storage debate = debates[index];
        Debate memory item;

        item.id = debate.id;
        item.description = debate.description;
        item.userLimit = debate.userLimit;
        item.userCount = debate.userCount;
        item.status = debate.status;
        item.fee = debate.fee;
        item.maxVoteCap = debate.maxVoteCap;
        item.minVoteCap = debate.minVoteCap;

        if (debate.status == DebateStatus.VOTE) {
            item.totalVoteCount = debate.totalVoteCount;
        } else if (debate.status == DebateStatus.COMPLETED) {
            item.totalVoteCount = debate.totalVoteCount;
            item.yesVoteCount = debate.yesVoteCount;
            item.noVoteCount = debate.noVoteCount;
            item.yesAmount = debate.yesAmount;
            item.noAmount = debate.noAmount;
        }

        return item;
    }

    function userVoteEnabled(uint256 index, address addr)
        external
        view
        returns (bool)
    {
        return
            debates[index].status == DebateStatus.VOTE &&
            allowedUsers[index][addr] &&
            !contributedUsers[index][addr];
    }
}
