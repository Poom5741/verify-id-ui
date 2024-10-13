import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'delete_identity' : ActorMethod<[string], boolean>,
  'get_identity' : ActorMethod<
    [string],
    [] | [{ 'did' : string, 'name' : string, 'email' : string }]
  >,
  'register_identity' : ActorMethod<[string, string, string], boolean>,
  'update_identity' : ActorMethod<[string, string, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
