/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActiveStatus } from "./ActiveStatus";
import type { Address } from "./Address";
import type { Fid } from "./Fid";
export type User = {
    object: User.OBJ;
    fid: Fid;
    username: string;
    display_name: string;
    custody_address?: Address;
    /**
     * The URL of the user's profile picture
     */
    pfp_url: string;
    profile: {
        bio: {
            text: string;
            mentioned_profiles: Array<string>;
        };
    };
    /**
     * The number of followers the user has.
     */
    follower_count: number;
    /**
     * The number of users the user is following.
     */
    following_count: number;
    verifications: Array<Address>;
    active_status: ActiveStatus;
    viewer_context?: {
        following: boolean;
        followed_by: boolean;
    };
};
export namespace User {
    export enum OBJ {
        USER = "user",
    }
}
