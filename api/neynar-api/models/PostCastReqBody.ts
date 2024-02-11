/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CastParent } from './CastParent';
import type { EmbeddedCast } from './EmbeddedCast';
import type { SignerUUID } from './SignerUUID';
export type PostCastReqBody = {
    signer_uuid: SignerUUID;
    text?: string;
    embeds?: Array<EmbeddedCast>;
    parent?: CastParent;
    /**
     * Channel ID of the channel where the cast is to be posted. e.g. neynar, farcaster, warpcast
     */
    channel_id?: string;
};

