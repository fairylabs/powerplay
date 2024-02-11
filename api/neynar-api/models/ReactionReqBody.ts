/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReactionType } from './ReactionType';
import type { SignerUUID } from './SignerUUID';
export type ReactionReqBody = {
    signer_uuid: SignerUUID;
    reaction_type: ReactionType;
    target: string;
};

