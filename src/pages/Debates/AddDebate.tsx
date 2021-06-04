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
import { useDebate } from '../../contexts/debates';

const AddDebate = () => {
  const { createDebate } = useDebate();
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const onAdd = async () => {
    setLoading(true);
    await createDebate(description);
    setDescription('');
    setLoading(false);
  };

  return (
    <Card aria-disabled={loading}>
      {loading && <LinearProgress />}

      <CardHeader title="Add Debate" />

      <CardContent>
        <TextField
          id="description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </CardContent>

      <CardActions>
        <Button
          variant="contained"
          color="primary"
          onClick={onAdd}
          disabled={description.length === 0 || loading}
        >
          Add
        </Button>
      </CardActions>
    </Card>
  );
};

export default AddDebate;
