import {TypedRecord, recordify} from 'typed-immutable-record';
import { List } from 'immutable';

export interface INodeInfo {
    network: string,
    version: string,
    consensusVersion: string
    blockchainHeight: number
}

export interface IBlockchain {
    connected: boolean,
    nodeInfo: INodeInfo,
    validatorInfo: INodeInfo,
    localStatus: any,
    validatorStatus: any,
    syncing: boolean,
    blocksRemainingToSync: number,
    validators: string[]
    api: string
}

const NODE_INITIAL_STATE: INodeInfo = {
    network: '',
    version: '',
    consensusVersion: '',
    blockchainHeight: 0
};

export const INITIAL_STATE: IBlockchain = {
    connected: false,
    nodeInfo: NODE_INITIAL_STATE,
    validatorInfo: NODE_INITIAL_STATE,
    localStatus: {},
    validatorStatus: {},
    syncing: true,
    blocksRemainingToSync: 0,
    validators: [],
    api: 'http://localhost:46657',
};

export const INITIAL_RECORD = recordify<IBlockchain, IBlockchainRecord>(INITIAL_STATE);

export interface IBlockchainRecord extends TypedRecord<IBlockchainRecord>, IBlockchain {}
export interface INodeInfoRecord extends TypedRecord<INodeInfoRecord>, INodeInfo {};

export function NodeInfoRecordFactory(item: INodeInfo): INodeInfoRecord {
    return recordify<INodeInfo, INodeInfoRecord>(NODE_INITIAL_STATE, item)
};

export function BlockchainRecordFactory(item: IBlockchain): IBlockchainRecord {
    if (!item) {
        return recordify<IBlockchain, IBlockchainRecord>(INITIAL_STATE, item);
    }

    return recordify<IBlockchain, IBlockchainRecord>(item);
}
