import React, { useCallback, useEffect, useState } from 'react';
import { Box, Card, CardContent, CardHeader, makeStyles, Typography } from '@material-ui/core';
import { DebateItem } from '../../contexts/debates';
import { futarchyContract } from '../../chain/contracts';
import { web3 } from '../../chain/web3';

interface IVoteHistory {
	debate: DebateItem;
}

interface IVoteHistoryItem {
	event: any;
}

const useStyles = makeStyles(theme => ({
	content: {
		maxHeight: 100,
		overflow: 'auto',
	},
	item: {
		display: 'flex',
		alignItems: 'center',
		paddingLeft: 50,
	},
}));

const VoteHistoryItem: React.FC<IVoteHistoryItem> = ({ event }) => {
	const classes = useStyles();
	const [time, setTime] = useState<Maybe<Date>>(null);

	const getTimeData = useCallback(async () => {
		const res = (await web3.eth.getBlock(event.blockNumber)).timestamp;
		if (res) {
			setTime(new Date(Number(res) * 1000));
		}
	}, []);

	useEffect(() => {
		getTimeData();
	}, []);

	return (
		<Box className={classes.item}>
			<Typography style={{ width: 500 }}>{event.returnValues[0]}</Typography>
			<Typography>Voted at {time?.toLocaleString()}</Typography>
		</Box>
	);
};

const VoteHistory: React.FC<IVoteHistory> = ({ debate }) => {
	const classes = useStyles();
	const [events, setEvents] = useState<any[]>([]);

	const getHistory = useCallback(async () => {
		const res = await futarchyContract.contract.getPastEvents('VoteEvent', {
			filter: { _debateId: debate.id },
			fromBlock: 6152181,
			toBlock: 'latest',
		});
		if (res) {
			setEvents(res);
		}
	}, [debate]);

	useEffect(() => {
		getHistory();
	}, [debate]);

	return (
		<Card style={{ marginTop: 20 }}>
			<CardHeader title="History" />

			<CardContent className={classes.content}>
				{events.map((event, idx) => (
					<VoteHistoryItem key={idx} event={event} />
				))}
			</CardContent>
		</Card>
	);
};

export default VoteHistory;
