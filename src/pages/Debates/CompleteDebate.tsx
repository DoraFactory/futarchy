import React, { useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  LinearProgress,
} from '@material-ui/core';
import { DebateItem, useDebate } from '../../contexts/debates';

interface ICompleteDebate {
  debate: DebateItem;
  onUpdate: () => void;
}

const CompleteDebate: React.FC<ICompleteDebate> = ({ debate, onUpdate }) => {
  const { completeDebate } = useDebate();
  const [loading, setLoading] = useState(false);

  const onComplete = async () => {
    setLoading(true);
    await completeDebate(debate.id);
    onUpdate();
    setLoading(false);
  };

  return (
    <Card aria-disabled={loading} style={{ marginTop: 20 }}>
      {loading && <LinearProgress />}

      <CardHeader title="Finalize Debate" />

      <CardActions>
        <Button
          variant="contained"
          color="primary"
          onClick={onComplete}
          disabled={loading}
        >
          Finalize
        </Button>
      </CardActions>
    </Card>
  );
};

export default CompleteDebate;
