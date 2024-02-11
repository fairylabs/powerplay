/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from "./User";
export type Channel = {
    id: string;
    url: string;
    name?: string;
    description?: string;
    object: Channel.OBJ;
    /**
     * Epoch timestamp in seconds.
     */
    created_at?: number;
    image_url?: string;
    lead?: User;
};
export namespace Channel {
    export enum OBJ {
        CHANNEL = "channel",
    }
}
