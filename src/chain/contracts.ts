import config from '../config';
import { web3 } from './web3';

export const futarchyContract = {
  contract: new web3.eth.Contract(
    config.futarchyAbi as any,
    config.futarchyContractAddress
  ),
  address: config.futarchyContractAddress,
};
