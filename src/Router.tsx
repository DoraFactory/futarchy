import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import Header from './components/Header';
import ConnectPage from './pages/ConnectPage';
import { Route, Switch } from 'react-router-dom';
import Debates from './pages/Debates';
import { useWallet } from './contexts/wallets';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  content: {
    padding: theme.spacing(3),
    boxSizing: 'border-box',
    height: 'calc(100% - 64px)',
  },
}));

function Router() {
  const classes = useStyles();
  const { connected } = useWallet();

  return (
    <Box className={classes.root}>
      <Header />

      <main className={classes.content}>
        {!connected ? (
          <ConnectPage />
        ) : (
          <Switch>
            <Route path="/" component={Debates} />
          </Switch>
        )}
      </main>

      <ToastContainer />
    </Box>
  );
}

export default Router;
