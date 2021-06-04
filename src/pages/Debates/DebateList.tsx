import React, { useEffect } from 'react';
import { Box, Card, CardContent, CardHeader, makeStyles, Typography } from '@material-ui/core';
import { useWallet } from '../../contexts/wallets';
import AddDebate from './AddDebate';
import { useDebate } from '../../contexts/debates';
import StatusTag from '../../components/StatusTag';
import { useHistory } from 'react-router';
import ClaimRewards from './ClaimRewards';

const useStyles = makeStyles(theme => ({
	debateList: {
		display: 'grid',
		gridGap: theme.spacing(1),
		gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
	},
	debateItem: {
		width: 300,
		height: 200,
		boxSizing: 'border-box',
		padding: 10,
		cursor: 'pointer',
	},
	debateItemHeader: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
}));

const DebateList = () => {
	const classes = useStyles();
	const history = useHistory();
	const { isAdmin } = useWallet();
	const { debateList, getDebateList } = useDebate();

	useEffect(() => {
		getDebateList();
	}, [getDebateList]);

	return (
		<Box>
			<ClaimRewards />

			{isAdmin && <AddDebate />}

			<Card style={{ marginTop: 20 }}>
				<CardHeader title="Debates" />

				<CardContent className={classes.debateList}>
					{debateList.map((debate, idx) => (
						<Card
							key={debate.id}
							className={classes.debateItem}
							onClick={() => {
								history.push(`/${debate.id}`);
							}}
						>
							<Box className={classes.debateItemHeader}>
								<Typography>Debate #{idx + 1}</Typography>
								<StatusTag status={debate.status} />
							</Box>

							<CardContent>
								<Typography variant="h6">{debate.description}</Typography>
							</CardContent>
						</Card>
					))}
				</CardContent>
			</Card>
		</Box>
	);
};

export default DebateList;
