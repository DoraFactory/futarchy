import React, { useCallback, useContext, useEffect, useState } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';
import { futarchyContract } from '../chain/contracts';
import config from '../config';

export interface IWalletContext {
	connected: boolean;
	address: Maybe<string>;
	isAdmin: boolean;
	connect: () => void;
}

export const metamaskInjected = new InjectedConnector({
	supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
});

const WalletContext = React.createContext<Maybe<IWalletContext>>(null);

export const WalletProvider = ({ children = null as any }) => {
	const [connected, setConnected] = useState<boolean>(false);
	const [address, setAddress] = useState<Maybe<string>>(null);
	const [isAdmin, setAdmin] = useState<boolean>(false);

	const { activate, deactivate, active, chainId, account } = useWeb3React();

	const connect = useCallback(async () => {
		try {
			await activate(metamaskInjected);
		} catch (err) {
			toast.error('Wallet connect failed!');
		}
	}, [activate]);

	useEffect(() => {
		connect();
	}, [connect, activate]);

	useEffect(() => {
		// If Binance Smart Chain
		if (active) {
			if (chainId) {
				if (chainId === config.networkId) {
					setConnected(true);
					toast.success('Wallet connected successfully!');
				} else {
					deactivate();
					toast.error('Please connect Binance Smart Chain!');
				}
			}
		} else {
			setConnected(false);
		}
	}, [active, chainId, deactivate]);

	useEffect(() => {
		setAddress(account);
	}, [account]);

	const getOwner = useCallback(async () => {
		const owner = await futarchyContract.contract.methods.owner().call();
		const admin = await futarchyContract.contract.methods.admins(account).call();
		setAdmin(owner === account || admin);
	}, [account]);

	useEffect(() => {
		if (connected) {
			getOwner();
		}
	}, [getOwner, connected, account]);

	return <WalletContext.Provider value={{ connected, address, isAdmin, connect }}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
	const context = useContext(WalletContext);

	if (!context) {
		throw new Error('Component rendered outside the provider tree');
	}

	return context;
};
