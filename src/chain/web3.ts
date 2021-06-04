import Web3 from 'web3';
import config from '../config';

const providerUrl = config.providerUrl;
const web3 = new Web3((window as any).ethereum || providerUrl);

export { Web3, providerUrl, web3 };
