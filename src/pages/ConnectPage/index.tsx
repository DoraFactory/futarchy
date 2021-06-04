import React from 'react';
import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import { useWallet } from '../../contexts/wallets';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  title: {
    marginBottom: theme.spacing(2),
  },
}));

const ConnectPage = () => {
  const classes = useStyles();
  const { connect } = useWallet();

  return (
    <Box className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        Connect your wallet to continue!
      </Typography>

      <Button variant="contained" color="primary" onClick={connect}>
        Connect To Metamask
      </Button>
    </Box>
  );
};

export default ConnectPage;
