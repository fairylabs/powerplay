/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { SignerUUID } from './SignerUUID';
export type AddVerificationReqBody = {
    signer_uuid: SignerUUID;
    address: Address;
    block_hash: string;
    eth_signature: string;
};

