/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from "./User";
export type Reactions = {
    object: Reactions.OBJ;
    cast: {
        hash: string;
        object: Reactions.OBJ;
    };
    user: User;
};
export namespace Reactions {
    export enum OBJ {
        LIKES = "likes",
        RECASTS = "recasts",
    }
}
