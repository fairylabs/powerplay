/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CastNotificationType } from './CastNotificationType';
import type { EmbeddedCast } from './EmbeddedCast';
import type { Fid } from './Fid';
import type { Timestamp } from './Timestamp';
import type { User } from './User';
export type Cast = {
    hash: string;
    parent_hash: string | null;
    parent_url: string | null;
    parent_author: Fid;
    author: User;
    text: string;
    timestamp: Timestamp;
    embeds: Array<EmbeddedCast>;
    type?: CastNotificationType;
};

