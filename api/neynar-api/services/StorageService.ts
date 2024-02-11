/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Fid } from '../models/Fid';
import type { StorageAllocationsResponse } from '../models/StorageAllocationsResponse';
import type { StorageUsageResponse } from '../models/StorageUsageResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class StorageService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Fetches storage allocations for a given user
     * Fetches storage allocations for a given user
     * @param fid
     * @param apiKey API key required for authentication.
     * @returns StorageAllocationsResponse A list of storage allocations
     * @throws ApiError
     */
    public storageAllocations(
        fid: Fid,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<StorageAllocationsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/storage/allocations',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'fid': fid,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Fetches storage usage for a given user
     * Fetches storage usage for a given user
     * @param fid
     * @param apiKey API key required for authentication.
     * @returns StorageUsageResponse Details of storage usage
     * @throws ApiError
     */
    public storageUsage(
        fid: Fid,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<StorageUsageResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/storage/usage',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'fid': fid,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
