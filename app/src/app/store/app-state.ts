import {IDocusign, DocusignRecordFactory, INITIAL_RECORD as DOCUSIGN_INIT} from './state/docusign';
import {ISession, SessionFactory, INITIAL_STATE as SESSION_INIT} from './state/session';
import {IUphold, INITIAL_STATE as UPHOLD_INIT, UpholdRecordFactory} from './state/uphold';
import {IProfile, INITIAL_STATE as PROFILE_INIT, ProfileRecordFactory} from './state/profile';
import {IContract, ContractRecordFactory} from "./state/contract";
import {IBlockchain, INITIAL_STATE as BLOCKCHAIN_INIT, BlockchainRecordFactory} from "./state/blockchain";
import {IDevice, INITIAL_STATE as DEVICE_INIT, DeviceRecordFactory} from "./state/device";

export interface IAppState {
    router?: string;
    session?: ISession;
    device?: IDevice;
    profile?: IProfile;
    contract?: IContract;
    docusign?: IDocusign;
    uphold?: IUphold;
    blockchain?: IBlockchain;
}

export const INITIAL_STATE: IAppState = {
    router: null,
    session: SessionFactory(SESSION_INIT),
    device: DeviceRecordFactory(DEVICE_INIT),
    profile: ProfileRecordFactory(PROFILE_INIT),
    contract: ContractRecordFactory(null),
    docusign: DOCUSIGN_INIT,
    uphold: UpholdRecordFactory(UPHOLD_INIT),
    blockchain: BlockchainRecordFactory(BLOCKCHAIN_INIT)
};

export function deimmutify(store) {
    return {
        router: store.router,
        session: store.session.toJS(),
        device: store.device.toJS(),
        profile: store.profile.toJS(),
        contract: store.contract.toJS(),
        docusign: store.docusign.toJS(),
        uphold: store.uphold.toJS(),
        blockchain: store.blockchain.toJS(),
    };
}

export function reimmutify(plain) {
    return {
        router: plain.router,
        session: SessionFactory(plain.session),
        device: DeviceRecordFactory(plain.device),
        profile: ProfileRecordFactory(plain.profile),
        contract: ContractRecordFactory(plain.contract),
        docusign: DocusignRecordFactory(plain.docusign),
        uphold: UpholdRecordFactory(plain.uphold),
        blockchain: BlockchainRecordFactory(plain.blockchain)
    };
}
