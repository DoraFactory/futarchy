import React, { useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  LinearProgress,
  TextField,
} from '@material-ui/core';
import { DebateItem, useDebate } from '../../contexts/debates';
import { toast } from 'react-toastify';

interface IStartVote {
  debate: DebateItem;
  onUpdate: () => void;
}

const StartVote: React.FC<IStartVote> = ({ debate, onUpdate }) => {
  const { startVote } = useDebate();
  const [loading, setLoading] = useState(false);
  const [maxVote, setMaxVote] = useState('0.5');
  const [minVote, setMinVote] = useState('0.1');
  const [fee, setFee] = useState('10');

  const validate = () => {
    if (
      isNaN(Number(maxVote)) ||
      isNaN(Number(minVote)) ||
      isNaN(Number(fee))
    ) {
      toast.error('Input should be number');
      return false;
    }
    if (Number(maxVote) <= 0 || Number(minVote) <= 0) {
      toast.error('Vote cap cannot be zero or negative');
      return false;
    }
    if (Number(maxVote) < Number(minVote)) {
      toast.error('Max vote cap should be equal or higher than min vote cap');
      return false;
    }
    if (Number(fee) < 0) {
      toast.error('Fee cannot be negative');
      return false;
    }
    if (Number(fee) >= 100) {
      toast.error('Fee should be less than 100%');
      return false;
    }
    return true;
  };

  const onStartVote = async () => {
    if (validate()) {
      setLoading(true);
      await startVote(debate.id, Number(maxVote), Number(minVote), Number(fee));
      onUpdate();
      setLoading(false);
    }
  };

  return (
    <Card aria-disabled={loading} style={{ marginTop: 20 }}>
      {loading && <LinearProgress />}

      <CardHeader title="Start Voting" />

      <CardContent>
        <TextField
          id="maxVote"
          label="Max Vote Cap (BNB)"
          value={maxVote}
          onChange={(e) => setMaxVote(e.target.value)}
          disabled={loading}
          style={{ margin: 10 }}
        />
        <TextField
          id="minVote"
          label="Min Vote Cap (BNB)"
          value={minVote}
          onChange={(e) => setMinVote(e.target.value)}
          disabled={loading}
          style={{ margin: 10 }}
        />
        <TextField
          id="fee"
          label="Service Fee (%)"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          disabled={loading}
          style={{ margin: 10 }}
        />
      </CardContent>

      <CardActions>
        <Button
          variant="contained"
          color="primary"
          onClick={onStartVote}
          disabled={loading}
        >
          Start Vote
        </Button>
      </CardActions>
    </Card>
  );
};

export default StartVote;
