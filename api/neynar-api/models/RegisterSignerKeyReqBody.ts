/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SignerUUID } from './SignerUUID';
export type RegisterSignerKeyReqBody = {
    signer_uuid: SignerUUID;
    /**
     * Signature generated by the custody address of the app. Signed data includes app_fid, deadline, signer’s public key
     */
    signature: string;
    /**
     * Application FID
     */
    app_fid: number;
    /**
     * unix timestamp in seconds that controls how long the signed key request is valid for. (24 hours from now is recommended)
     */
    deadline: number;
};
