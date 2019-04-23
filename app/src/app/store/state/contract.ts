import {TypedRecord, recordify} from 'typed-immutable-record';
import {List} from 'immutable';
import {toRecordOrNull, toTypedList, sanitizedMerge, parseDate, sMerge} from "../utils";
import { ISignature, SignatureFactory } from './signature';

export interface IImage {
   address: string;
   encoding: string;
   base64Encoded: string;
}

export function ImageFactory(m: any) {
   let record = recordify<IImage, IImageRecord>({
      address: null,
      encoding: null,
      base64Encoded: null
      });

   if (!m) {
      return record;
   }

   return sanitizedMerge(m, record);
}

export interface IPublicState {
   title: string;
   description: string;
   cover: IImage;
}

export function PublicStateFactory(m: any) {
   let record = recordify<IPublicState, IPublicStateRecord>(
      {
         title: null,
         description: null,
         cover: ImageFactory(null).toJS()
      });

   if (!m) {
      return record;
   }

   record = sanitizedMerge(m, record);
   return record.merge({
      cover: ImageFactory(m.cover)
   });
}

export interface IPrivateState {
   coverAddr: string;
   documentAddr: string;
   documentSize: string;
}

export function PrivateStateFactory(m: any) {
   let record = recordify<IPrivateState, IPrivateStateRecord>({
      coverAddr: null,
      documentAddr: null,
      documentSize: null
   });

   if (!m) {
      return record;
   }

   return sanitizedMerge(m, record);
}

export interface IPublicStateChain {
   current: IPublicState;
   previous: string;
}

export function PublicStateChainFactory(m: any) {
   let record = recordify<IPublicStateChain, IPublicStateChainRecord>({
      current: PublicStateFactory(null).toJS(),
      previous: null
   });

   if (!m) {
      return record;
   }

   record = sanitizedMerge(m, record);
   return record.merge({
      current: PublicStateFactory(m.current)
   });
}

export interface IPrivateStateChain {
   current: IPrivateState;
   previous: string;
}

export function PrivateStateChainFactory(m: any) {
   let record = recordify<IPrivateStateChain, IPrivateStateChainRecord>({
      current: PrivateStateFactory(null).toJS(),
      previous: null
   });

   if (!m) {
      return record;
   }

   record = sanitizedMerge(m, record);
   return record.merge({
      current: PrivateStateFactory(m.current)
   });
}

export interface IPermission {
   signature: ISignature;
   capabilities: string[];
   createdAt?: Date;
   updatedAt?: Date;
   price?: string;
}

export interface IContractMeta {
   contractId: string;
   name: string;
   version: string;
   blockchain: string;
   compiler: string;
   address: string;
   creator: string;
   issuer: string;
   blockNumber: number;
   blockHash: string;
   transactionHash: string;
   transactionIndex: number;
   createdAt: Date;
}

export function ContractMetaFactory(m: any) {
   let record = recordify<IContractMeta, IContractMetaRecord>({
      contractId: '',
      name: 'Document',
      version: '',
      blockchain: 'ETH',
      compiler: 'solidity 0.4.4',
      address: '',
      creator: '',
      issuer: '',
      blockNumber: 0,
      blockHash: '',
      transactionHash: '',
      transactionIndex: 0,
      createdAt: new Date()
   });

   if (!m) {
      return record;
   }

   record = sanitizedMerge(m, record);
   return record.merge({
      createdAt: parseDate(m.createdAt)
   });
}

export interface IPurchaseReceipt {
   blockNumber: number;
   transactionHash: string;
}

export function PurchaseReceiptFactory(r: any) {
   let record = recordify<IPurchaseReceipt, IPurchaseReceiptRecord>({
      blockNumber: 0,
      transactionHash: null
   });

   if (!r) {
      return record;
   }

   return sanitizedMerge(r, record);
}

export interface IContractHeader {
   name: string;
   description: string;
   phone: string;
   coordinates: string;
   notes: string;
   farmer: string;
   region: string;
   district: string;
   sumInsured: string;
   premium: string;
   months: string;
   strike: string;
   level: string;
   contractType: string;
   creator: ISignature;
   issuer: ISignature;
   owner: ISignature;
   counterparty: ISignature;
}

export function ContractHeaderFactory(c: IContractHeader) {
   let record = recordify<IContractHeader, IContractHeaderRecord>({
      name: '',
      description: '',
      phone: '',
      coordinates: '',
      notes: '',
      farmer: '',
      region: '',
      district: '',
      sumInsured: '',
      premium: '',
      months: '',
      strike: '',
      level: '',
      contractType: '',
      creator: SignatureFactory(null).toJS(),
      issuer: SignatureFactory(null).toJS(),
      owner: SignatureFactory(null).toJS(),
      counterparty: SignatureFactory(null).toJS()
   });

   if (!c) {
      return record;
   }

   record = sanitizedMerge(c, record);

   return record.merge({
      creator: SignatureFactory(c.creator),
      issuer: SignatureFactory(c.issuer),
      owner: SignatureFactory(c.owner),
      counterparty: SignatureFactory(c.counterparty)
   });
}

export interface IContract {
   state: string;
   error: string;
   statusLog: List<string>;
   publicStateChain: IPublicStateChain;
   privateStateChain?: IPrivateStateChain;
   unlocked: boolean;
   loaded: boolean;
   description: string;
   contractId: string;
   signatureId: string;
   headerAddr: string;
   metaAddr: string;
   header: IContractHeader;
   meta: IContractMeta;
   termsAddr: string;
   mediaAddr: string;
   creatorAccount: string;
   issuerAccount: string;
   ownerAccount: string;
   owner: ISignature;
   counterpartyAccount: string;
   price: string;
   fields: any;
   actions: any;
   permissions: List<IPermission> | IPermission[];
   purchaseReceipt?: IPurchaseReceipt;
}

export const contractState = {
   INITIALISED: 'INITIALISED',
   ERROR: 'ERROR',
   PAYING_FEE: 'PAYING_FEE',
   CREATING: 'CREATING',
   GENERATING_OWNER_KEY: 'GENERATING_OWNER_KEY',
   GENERATING_CONTRACT_KEY: 'GENERATING_CONTRACT_KEY',
   CREATED: 'CREATED',
   READY: 'READY',
   SIGNING: 'SIGNING',
   SIGNED: 'SIGNED',
   LOCKED: 'LOCKED',
   UNLOCKING: 'UNLOCKING',
   UNLOCKED: 'UNLOCKED',
};

export const INITIAL_RECORD = ContractRecordFactory(null);

export interface IImageRecord extends TypedRecord<IImageRecord>, IImage {
}

export interface IPublicStateRecord extends TypedRecord<IPublicStateRecord>, IPublicState {
}

export interface IPrivateStateRecord extends TypedRecord<IPrivateStateRecord>, IPrivateState {
}

export interface IPublicStateChainRecord extends TypedRecord<IPublicStateChainRecord>, IPublicStateChain {
}

export interface IPrivateStateChainRecord extends TypedRecord<IPrivateStateChainRecord>, IPrivateStateChain {
}

export interface IContractHeaderRecord extends TypedRecord<IContractHeaderRecord>, IContractHeader {
}

export interface IContractMetaRecord extends TypedRecord<IContractMetaRecord>, IContractMeta {
}

export interface IPurchaseReceiptRecord extends TypedRecord<IPurchaseReceiptRecord>, IPurchaseReceipt {
}

export interface IContractRecord extends TypedRecord<IContractRecord>, IContract {
}

export interface IPermissionRecord extends TypedRecord<IPermissionRecord>, IPermission {
}

export function PermissionFactory(item: IPermission) {
   return toRecordOrNull<IPermission, IPermissionRecord>(item);
}

export function PermissionsFactory(items: List<IPermission> | IPermission[]) {
   return toTypedList(items, (i: IPermission) =>
      PermissionFactory(i)
   );
}

export function ContractsFactory(contracts: List<IContract> | IContract[]) {
   return toTypedList(contracts, (c: IContract) =>
      ContractRecordFactory(c)
   );
}

   export function ContractRecordFactory(c: IContract): IContractRecord {
   let record = recordify<IContract, IContractRecord>({
      state: contractState.INITIALISED,
      error: '',
      statusLog: List<string>(),
      publicStateChain: PublicStateChainFactory(null),
      privateStateChain: null,
      unlocked: false,
      loaded: false,
      description: '',
      contractId: '',
      signatureId: '',
      headerAddr: '',
      metaAddr: '',
      header: ContractHeaderFactory(null),
      meta: ContractMetaFactory(null),
      termsAddr: '',
      mediaAddr: '',
      creatorAccount: '',
      issuerAccount: '',
      ownerAccount: '',
      owner: SignatureFactory(null).toJS(),
      counterpartyAccount: '',
      price: '',
      fields: {},
      actions: [],
      permissions: [],
      purchaseReceipt: null
   });

   if (!c) {
      return record;
   }

   record = sanitizedMerge(c, record);

   if (c.privateStateChain) {
      record = record.merge({
         privateStateChain: PrivateStateChainFactory(c.privateStateChain),
         unlocked: true
      });
   }

   if (c.owner) {
      record = record.merge({
         owner: SignatureFactory(c.owner)
      });
   }

   if (c.purchaseReceipt) {
      record = record.merge({
         purchaseReceipt: PurchaseReceiptFactory(c.purchaseReceipt)
      });
   }

   return record.merge({
      contractId: c.meta.contractId,
      meta: ContractMetaFactory(c.meta),
      publicStateChain: PublicStateChainFactory(c.publicStateChain),
      permissions: PermissionsFactory(c.permissions)
   });
}
