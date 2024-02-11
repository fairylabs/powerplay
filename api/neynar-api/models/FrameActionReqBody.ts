/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CastHash } from './CastHash';
import type { FrameAction } from './FrameAction';
import type { SignerUUID } from './SignerUUID';
export type FrameActionReqBody = {
    signer_uuid: SignerUUID;
    cast_hash: CastHash;
    action: FrameAction;
};

