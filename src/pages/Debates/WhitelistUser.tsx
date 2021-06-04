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

interface IWhitelistUser {
  debate: DebateItem;
  onUpdate: () => void;
}

const WhitelistUser: React.FC<IWhitelistUser> = ({ debate, onUpdate }) => {
  const { whitelistUser } = useDebate();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const onAdd = async () => {
    setLoading(true);
    await whitelistUser(debate.id, address);
    onUpdate();
    setLoading(false);
  };

  return (
    <Card aria-disabled={loading} style={{ marginTop: 20 }}>
      {loading && <LinearProgress />}

      <CardHeader
        title={`Whitelist User (${debate.userCount}/${debate.userLimit})`}
      />

      <CardContent>
        <TextField
          id="address"
          label="User Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={loading}
          style={{ width: 400 }}
        />
      </CardContent>

      <CardActions>
        <Button
          variant="contained"
          color="primary"
          onClick={onAdd}
          disabled={address.length === 0 || loading}
        >
          Add User
        </Button>
      </CardActions>
    </Card>
  );
};

export default WhitelistUser;
