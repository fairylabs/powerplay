/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StorageObject } from './StorageObject';
import type { UserDehydrated } from './UserDehydrated';
export type StorageUsageResponse = {
    object?: string;
    user?: UserDehydrated;
    casts?: StorageObject;
    reactions?: StorageObject;
    links?: StorageObject;
    verified_addresses?: StorageObject;
    username_proofs?: StorageObject;
    signers?: StorageObject;
    total_active_units?: number;
};

