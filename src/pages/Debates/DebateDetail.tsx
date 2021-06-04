import React, { useCallback, useEffect, useState } from 'react';
import { Box, Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import { useWallet } from '../../contexts/wallets';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { DebateItem, DebateStatus, useDebate } from '../../contexts/debates';
import WhitelistUser from './WhitelistUser';
import StatusTag from '../../components/StatusTag';
import StartVote from './StartVote';
import UserVote from './UserVote';
import CompleteDebate from './CompleteDebate';
import ClaimRewards from './ClaimRewards';
import VoteHistory from './VoteHistory';

const useStyles = makeStyles(theme => ({
	detailContainer: {
		padding: 10,
	},
	detailHeader: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	completedContent: {
		display: 'flex',
		alignItems: 'center',
	},
	contentList: {
		width: 400,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
}));

const DebateDetail = () => {
	const {
		params: { id },
	} = useRouteMatch<{ id: string }>();
	const { isAdmin } = useWallet();
	const { getDebateDetail, voteAllowed } = useDebate();
	const classes = useStyles();
	const history = useHistory();

	const [debate, setDebate] = useState<Maybe<DebateItem>>(null);
	const [votingAllowed, setVotingAllowed] = useState<boolean>(false);

	const getDetail = useCallback(async () => {
		if (!isNaN(Number(id))) {
			const item = await getDebateDetail(Number(id));
			if (item) {
				setDebate(item);
			} else {
				history.push('/');
			}

			const allowRes = await voteAllowed(Number(id));
			setVotingAllowed(allowRes);
		}
	}, [getDebateDetail, voteAllowed, history, id]);

	useEffect(() => {
		getDetail();
	}, [getDetail, getDebateDetail, voteAllowed, history, id]);

	return debate ? (
		<Box>
			<ClaimRewards />

			<Card className={classes.detailContainer}>
				<Box className={classes.detailHeader}>
					<Typography variant="h5">{debate.description}</Typography>
					<StatusTag status={debate.status} />
				</Box>

				<CardContent>
					{debate.status === DebateStatus.DEBATE && <Typography>Voting has not been started yet</Typography>}

					{debate.status === DebateStatus.VOTE && (
						<>
							<Typography variant="h6">
								<b>{debate.totalVoteCount}</b> people voted
							</Typography>

							<Typography variant="h6">
								Max Vote Cap: <b>{debate.maxVoteCap}</b> BNB
							</Typography>

							<Typography variant="h6">
								Min Vote Cap: <b>{debate.minVoteCap}</b> BNB
							</Typography>

							<Typography variant="h6">
								Service Fee: <b>{debate.fee}</b>%
							</Typography>
						</>
					)}

					{debate.status === DebateStatus.COMPLETED && (
						<Box className={classes.completedContent}>
							<Box className={classes.contentList}>
								<Typography variant="h6">Proposition</Typography>
								<Typography variant="h6">
									<b>{debate.yesVoteCount}</b> votes
								</Typography>
								<Typography variant="h6">
									<b>{debate.yesAmount}</b> BNB
								</Typography>
								<Typography variant="h6">
									<b>{debate.yesAmount >= debate.noAmount ? 'WINS!!!' : 'LOSE'}</b>
								</Typography>
							</Box>

							<Box className={classes.contentList}>
								<Typography variant="h6">Opposition</Typography>
								<Typography variant="h6">
									<b>{debate.noVoteCount}</b> votes
								</Typography>
								<Typography variant="h6">
									<b>{debate.noAmount}</b> BNB
								</Typography>
								<Typography variant="h6">
									<b>{debate.yesAmount <= debate.noAmount ? 'WINS!!!' : 'LOSE'}</b>
								</Typography>
							</Box>
						</Box>
					)}
				</CardContent>
			</Card>

			{debate.status === DebateStatus.VOTE && votingAllowed && (
				<UserVote debate={debate} onUpdate={() => getDetail()} />
			)}

			{(debate.status === DebateStatus.VOTE || debate.status === DebateStatus.COMPLETED) && (
				<VoteHistory debate={debate} />
			)}

			{isAdmin && (
				<>
					{debate.status === DebateStatus.DEBATE && (
						<>
							<WhitelistUser debate={debate} onUpdate={() => getDetail()} />
							<StartVote debate={debate} onUpdate={() => getDetail()} />
						</>
					)}
					{debate.status === DebateStatus.VOTE && <CompleteDebate debate={debate} onUpdate={() => getDetail()} />}
				</>
			)}
		</Box>
	) : null;
};

export default DebateDetail;
