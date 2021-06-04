import React from 'react';
import { Chip } from '@material-ui/core';
import { DebateStatus } from '../../contexts/debates';

interface IStatusTag {
  status: DebateStatus;
}

const StatusTag: React.FC<IStatusTag> = ({ status }) => {
  return status === DebateStatus.DEBATE ? (
    <Chip color="default" label="DEBATE" />
  ) : status === DebateStatus.VOTE ? (
    <Chip color="primary" label="VOTING" />
  ) : (
    <Chip color="secondary" label="COMPLETED" />
  );
};

export default StatusTag;
