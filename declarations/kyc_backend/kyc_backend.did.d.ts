import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'approve_kyc' : ActorMethod<[string], boolean>,
  'get_kyc_status' : ActorMethod<
    [string],
    [] | [{ 'status' : string, 'user_id' : string, 'document' : string }]
  >,
  'reject_kyc' : ActorMethod<[string], boolean>,
  'submit_kyc' : ActorMethod<[string, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
