import React, { useState } from 'react';
import { Button, Card, CardActions, CardContent, CardHeader, LinearProgress, TextField } from '@material-ui/core';
import { DebateItem, useDebate } from '../../contexts/debates';
import { toast } from 'react-toastify';

interface IUserVote {
	debate: DebateItem;
	onUpdate: () => void;
}

const UserVote: React.FC<IUserVote> = ({ debate, onUpdate }) => {
	const { voteDebate } = useDebate();
	const [loading, setLoading] = useState(false);
	const [value, setValue] = useState('');

	const validate = () => {
		if (isNaN(Number(value))) {
			toast.error('Amount should be number');
			return false;
		}
		if (Number(value) < debate.minVoteCap || Number(value) > debate.maxVoteCap) {
			toast.error('Amount should be between Min Vote Cap and Max Vote Cap');
			return false;
		}
		return true;
	};

	const onVoteClick = async (answer: boolean) => {
		if (validate()) {
			setLoading(true);
			await voteDebate(debate.id, Number(value), answer);
			onUpdate();
			setLoading(false);
		}
	};

	return (
		<>
			<Card style={{ marginTop: 20 }}>
				{loading && <LinearProgress />}

				<CardHeader title="Vote" />

				<CardContent>
					<TextField
						id="value"
						label="Vote Amount (BNB)"
						value={value}
						onChange={e => setValue(e.target.value)}
						disabled={loading}
					/>
				</CardContent>

				<CardActions>
					<Button variant="contained" color="primary" disabled={loading} onClick={() => onVoteClick(true)}>
						Vote Proposition
					</Button>

					<Button
						variant="contained"
						color="secondary"
						disabled={loading}
						onClick={() => onVoteClick(false)}
						style={{ marginLeft: 20 }}
					>
						Vote Opposition
					</Button>
				</CardActions>
			</Card>
		</>
	);
};

export default UserVote;
