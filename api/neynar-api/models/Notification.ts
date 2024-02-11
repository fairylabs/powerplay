/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CastWithInteractions } from './CastWithInteractions';
import type { Follow } from './Follow';
import type { Reactions } from './Reactions';
export type Notification = {
    object: string;
    most_recent_timestamp: string;
    type: Notification.type;
    follows?: Array<Follow>;
    cast?: CastWithInteractions;
    reactions?: Array<Reactions>;
};
export namespace Notification {
    export enum type {
        FOLLOWS = 'follows',
        RECASTS = 'recasts',
        LIKES = 'likes',
        MENTION = 'mention',
        REPLY = 'reply',
    }
}

