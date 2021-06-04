import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { futarchyContract } from '../chain/contracts';
import { useWallet } from './wallets';
import { web3 } from '../chain/web3';

export enum DebateStatus {
	DEBATE = 0,
	VOTE = 1,
	COMPLETED = 2,
}

export interface DebateItem {
	id: number;
	description: string;
	userLimit: number;
	userCount: number;
	status: DebateStatus;
	fee: number;
	maxVoteCap: number;
	minVoteCap: number;
	totalVoteCount: number;
	yesVoteCount: number;
	noVoteCount: number;
	yesAmount: number;
	noAmount: number;
}

export interface IDebateContext {
	debateList: DebateItem[];
	balance: number;
	getBalance: () => void;
	claimBalance: () => void;
	getDebateList: () => void;
	getDebateDetail: (id: number) => Promise<Maybe<DebateItem>>;
	voteAllowed: (id: number) => Promise<boolean>;
	createDebate: (description: string) => void;
	whitelistUser: (id: number, userAddr: string) => void;
	startVote: (id: number, maxVote: number, minVote: number, fee: number) => void;
	voteDebate: (id: number, value: number, answer: boolean) => void;
	completeDebate: (id: number) => void;
}

const DebateContext = React.createContext<Maybe<IDebateContext>>(null);

const USER_LIMIT = 100;

export const DebateProvider = ({ children = null as any }) => {
	const { address } = useWallet();
	const [debateList, setDebateList] = useState<DebateItem[]>([]);
	const [balance, setBalance] = useState<number>(0);

	const parseDebateItem = (item: Array<any>) => ({
		id: Number(item[0]),
		description: item[1],
		userLimit: Number(item[2]),
		userCount: Number(item[3]),
		status: Number(item[4]),
		fee: Number(item[5]),
		maxVoteCap: Number(web3.utils.fromWei(item[6])),
		minVoteCap: Number(web3.utils.fromWei(item[7])),
		totalVoteCount: Number(item[8]),
		yesVoteCount: Number(item[9]),
		noVoteCount: Number(item[10]),
		yesAmount: Number(web3.utils.fromWei(item[11])),
		noAmount: Number(web3.utils.fromWei(item[12])),
	});

	const getBalance = async () => {
		try {
			const res = await futarchyContract.contract.methods.balances(address).call();

			setBalance(Number(web3.utils.fromWei(res)));
		} catch (err) {
			toast.error(err.message);
		}
	};

	const claimBalance = async () => {
		try {
			await futarchyContract.contract.methods.claimBalance().send({ from: address });

			getBalance();

			toast.success('Rewards claimed successfully');
		} catch (err) {
			toast.error(err.message);
		}
	};

	const getDebateList = async () => {
		try {
			const res = await futarchyContract.contract.methods.getDebateList(address).call();

			const debates: DebateItem[] = [];
			res.forEach((item: any) => {
				debates.push(parseDebateItem(item));
			});

			setDebateList(debates);
		} catch (err) {
			toast.error(err.message);
		}
	};

	const getDebateDetail = async (id: number) => {
		try {
			const res = await futarchyContract.contract.methods.getDebateDetail(id, address).call();

			getBalance();

			return parseDebateItem(res);
		} catch (err) {
			toast.error(err.message);
		}
		return null;
	};

	const voteAllowed = async (id: number) => {
		try {
			const res = await futarchyContract.contract.methods.userVoteEnabled(id, address).call();

			return res;
		} catch (err) {
			toast.error(err.message);
		}
		return false;
	};

	const createDebate = async (description: string) => {
		try {
			await futarchyContract.contract.methods.createDebate(description, USER_LIMIT).send({ from: address });

			toast.success('Debate added successfully');

			getDebateList();
		} catch (err) {
			toast.error(err.message);
		}
	};

	const whitelistUser = async (id: number, userAddr: string) => {
		try {
			await futarchyContract.contract.methods.whitelistUser(id, userAddr).send({ from: address });

			toast.success('User added successfully');
		} catch (err) {
			toast.error(err.message);
		}
	};

	const startVote = async (id: number, maxVote: number, minVote: number, fee: number) => {
		try {
			await futarchyContract.contract.methods
				.startVote(id, web3.utils.toWei(String(maxVote)), web3.utils.toWei(String(minVote)), fee)
				.send({ from: address });

			toast.success('Voting started');
		} catch (err) {
			toast.error(err.message);
		}
	};

	const voteDebate = async (id: number, value: number, answer: boolean) => {
		try {
			await futarchyContract.contract.methods
				.voteDebate(id, answer)
				.send({ from: address, value: web3.utils.toWei(String(value)) });

			toast.success('Voted successfully');
		} catch (err) {
			toast.error(err.message);
		}
	};

	const completeDebate = async (id: number) => {
		try {
			await futarchyContract.contract.methods.completeDebate(id).send({ from: address });

			toast.success('Debate completed');
		} catch (err) {
			toast.error(err.message);
		}
	};

	return (
		<DebateContext.Provider
			value={{
				debateList,
				balance,
				getBalance,
				claimBalance,
				getDebateList,
				getDebateDetail,
				voteAllowed,
				createDebate,
				whitelistUser,
				startVote,
				voteDebate,
				completeDebate,
			}}
		>
			{children}
		</DebateContext.Provider>
	);
};

export const useDebate = () => {
	const context = useContext(DebateContext);

	if (!context) {
		throw new Error('Component rendered outside the provider tree');
	}

	return context;
};
