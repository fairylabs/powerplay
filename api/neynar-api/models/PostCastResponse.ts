/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { Fid } from './Fid';
export type PostCastResponse = {
    success: boolean;
    cast: {
        hash: Address;
        author: {
            fid: Fid;
        };
        text: string;
    };
};

