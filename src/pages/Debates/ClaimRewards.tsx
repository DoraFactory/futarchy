import React, { useEffect, useState } from 'react';
import { Button, Card, CardActions, CardContent, CardHeader, LinearProgress, Typography } from '@material-ui/core';
import { useDebate } from '../../contexts/debates';

const ClaimRewards = () => {
	const { balance, getBalance, claimBalance } = useDebate();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getBalance();
	}, []);

	const onClaim = async () => {
		setLoading(true);
		await claimBalance();
		setLoading(false);
	};

	return balance > 0 ? (
		<Card style={{ marginBottom: 20 }}>
			{loading && <LinearProgress />}

			<CardHeader title="Claim Rewards" />

			<CardContent>
				<Typography>
					Your Rewards: <b>{balance}</b> BNB
				</Typography>
			</CardContent>

			<CardActions>
				<Button variant="contained" color="primary" onClick={onClaim} disabled={loading}>
					Claim
				</Button>
			</CardActions>
		</Card>
	) : null;
};

export default ClaimRewards;
