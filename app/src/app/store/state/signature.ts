import { parseDate, sanitizedMerge, toTypedList } from '../utils';
import { recordify, TypedRecord } from 'typed-immutable-record';
import { List } from 'immutable';

export interface ISignature {
   signatureId: string;
   name: string;
   description: string;
   type: string;
   clientSide: boolean;
   account: string;
   privateKey: string;
   publicKey: string;
   createdAt: Date;
   updatedAt: Date;
}

export interface ISignatureRecord extends TypedRecord<ISignatureRecord>, ISignature {}

export function SignatureFactory(s): ISignatureRecord {
   let record = recordify<ISignature, ISignatureRecord>({
      signatureId: '',
      name: '',
      description: '',
      type: 'ETH',
      clientSide: false,
      account: '',
      privateKey: '',
      publicKey: '',
      createdAt: new Date(),
      updatedAt: new Date()
   });

   if (!s) {
      return record;
   }

   record = sanitizedMerge(s, record);
   return record.merge({
      createdAt: parseDate(s.createdAt)
   })
}

export function SignaturesFactory(signatures: List<ISignature> | ISignature[]) {
   return toTypedList(signatures, (s: ISignature) =>
      SignatureFactory(s)
   );
}
