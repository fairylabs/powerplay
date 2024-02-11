/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from "./User";
export type HydratedFollower = {
    object?: HydratedFollower.OBJ;
    user?: User;
};
export namespace HydratedFollower {
    export enum OBJ {
        FOLLOW = "follow",
    }
}
