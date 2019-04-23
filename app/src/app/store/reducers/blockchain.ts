import {IPayloadAction} from '../root-reducer';
import {BlockchainActions} from "../actions/blockchain";
import {IBlockchainRecord, INITIAL_RECORD, INodeInfo, NodeInfoRecordFactory} from "../state/blockchain";

export function blockchainReducer(
    state: IBlockchainRecord = INITIAL_RECORD,
    action: IPayloadAction): IBlockchainRecord {

    let payload = action.payload;

    switch (action.type) {
        case BlockchainActions.LOCAL_CONFIG:
            return state.merge({
                connected: true,
                validators: payload.validators,
                api: payload['consensus-api']
            });

        case BlockchainActions.LOAD_CONFIG_FAILED:
            return state.merge({
                connected: false
            });

        case BlockchainActions.VALIDATOR_STATUS_UPDATE:
            state = state.merge({
                validatorStatus: payload,
                validatorInfo: parseNodeInfo(payload)
            });

            return state.merge({
                syncing: isSyncing(state)
            });

        case BlockchainActions.LOCAL_STATUS_UPDATE:
            state = state.merge({
                localStatus: payload,
                nodeInfo: parseNodeInfo(payload)
            });

            return state.merge({
                syncing: isSyncing(state)
            });

        default:
            return state;
    }
}

function isSyncing(state: IBlockchainRecord): boolean {

    let localBlockHeight = state.nodeInfo.blockchainHeight;
    let validatorBlockHeight = state.validatorInfo.blockchainHeight;

    if (state.nodeInfo.blockchainHeight === 0 || state.validatorInfo.blockchainHeight === 0) {
        console.log("not connected");
        return true;
    }

    let diff = validatorBlockHeight - localBlockHeight;
    let syncing = diff > 10;

    return syncing
}


function parseNodeInfo(status: any): INodeInfo {
    let node_info = status && status.node_info || null;
    let blockchainHeight = status && status.latest_block_height || 0;

    let network = node_info && node_info.network || '';
    let version = node_info && node_info.version || '';

    let other = node_info && node_info.other || null;
    let consensusVersion = other && other.length > 4 && other[2] || '';
    let conSplit = consensusVersion.split("=");
    consensusVersion = conSplit.length === 2 && conSplit[1] || '';

    return NodeInfoRecordFactory({
         network: network,
         version: version,
         consensusVersion: consensusVersion,
         blockchainHeight: blockchainHeight
     });
}

