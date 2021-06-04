import React from 'react';
import { HashRouter } from 'react-router-dom';
import { WalletProvider } from './contexts/wallets';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import Router from './Router';

function App() {
  const getLibrary = (provider: any) => {
    const library = new Web3Provider(provider);
    library.pollingInterval = 8000;
    return library;
  };

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <WalletProvider>
        <HashRouter>
          <Router />
        </HashRouter>
      </WalletProvider>
    </Web3ReactProvider>
  );
}

export default App;
