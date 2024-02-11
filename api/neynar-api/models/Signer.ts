/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Fid } from './Fid';
import type { SignerUUID } from './SignerUUID';
export type Signer = {
    signer_uuid: SignerUUID;
    public_key: string;
    status: Signer.status;
    signer_approval_url?: string;
    fid?: Fid;
};
export namespace Signer {
    export enum status {
        GENERATED = 'generated',
        PENDING_APPROVAL = 'pending_approval',
        APPROVED = 'approved',
        REVOKED = 'revoked',
    }
}

