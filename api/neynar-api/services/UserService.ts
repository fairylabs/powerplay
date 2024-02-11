/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddVerificationReqBody } from '../models/AddVerificationReqBody';
import type { BulkFollowResponse } from '../models/BulkFollowResponse';
import type { BulkUsersByAddressResponse } from '../models/BulkUsersByAddressResponse';
import type { BulkUsersResponse } from '../models/BulkUsersResponse';
import type { Fid } from '../models/Fid';
import type { FollowReqBody } from '../models/FollowReqBody';
import type { OperationResponse } from '../models/OperationResponse';
import type { RemoveVerificationReqBody } from '../models/RemoveVerificationReqBody';
import type { UpdateUserReqBody } from '../models/UpdateUserReqBody';
import type { UserResponse } from '../models/UserResponse';
import type { UserSearchResponse } from '../models/UserSearchResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class UserService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Search for Usernames
     * Search for Usernames
     * @param q
     * @param viewerFid
     * @param apiKey API key required for authentication.
     * @returns UserSearchResponse Successful operation.
     * @throws ApiError
     */
    public userSearch(
        q: string,
        viewerFid: Fid,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<UserSearchResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/user/search',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'q': q,
                'viewer_fid': viewerFid,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Fetches information about multiple users based on FIDs
     * Fetches information about multiple users based on FIDs
     * @param fids Comma separated list of FIDs, up to 100 at a time
     * @param apiKey API key required for authentication.
     * @param viewerFid
     * @returns BulkUsersResponse Successful operation.
     * @throws ApiError
     */
    public userBulk(
        fids: string,
        apiKey: string = 'NEYNAR_API_DOCS',
        viewerFid?: Fid,
    ): CancelablePromise<BulkUsersResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/user/bulk',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'fids': fids,
                'viewer_fid': viewerFid,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Fetches all users based on multiple Ethereum addresses
     * Fetches all users based on multiple Ethereum addresses.
     *
     * Each farcaster user has a custody Ethereum address and optionally verified Ethereum addresses. This endpoint returns all users that have any of the given addresses as their custody or verified Ethereum addresses.
     *
     * A custody address can be associated with only 1 farcaster user at a time but a verified address can be associated with multiple users.
     * @param addresses Comma separated list of Ethereum addresses, up to 350 at a time
     * @param apiKey API key required for authentication.
     * @returns BulkUsersByAddressResponse Successful operation.
     * @throws ApiError
     */
    public userBulkByAddress(
        addresses: string,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<BulkUsersByAddressResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/user/bulk-by-address',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'addresses': addresses,
            },
            errors: {
                400: `Bad Request`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Update user profile
     * Update user profile \
     * (In order to update user's profile `signer_uuid` must be approved)
     *
     * @param requestBody
     * @param apiKey API key required for authentication.
     * @returns OperationResponse Successful operation.
     * @throws ApiError
     */
    public updateUser(
        requestBody: UpdateUserReqBody,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<OperationResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/farcaster/user',
            headers: {
                'api_key': apiKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                404: `Resource not found`,
                500: `Server Error`,
            },
        });
    }
    /**
     * Adds verification for an eth address for the user
     * Adds verification for an eth address for the user \
     * (In order to add verification `signer_uuid` must be approved)
     *
     * @param requestBody
     * @param apiKey API key required for authentication.
     * @returns OperationResponse Successful operation.
     * @throws ApiError
     */
    public postFarcasterUserVerification(
        requestBody: AddVerificationReqBody,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<OperationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/farcaster/user/verification',
            headers: {
                'api_key': apiKey,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Removes verification for an eth address for the user
     * Removes verification for an eth address for the user \
     * (In order to delete verification `signer_uuid` must be approved)
     *
     * @param requestBody
     * @param apiKey API key required for authentication.
     * @returns OperationResponse Successful operation.
     * @throws ApiError
     */
    public deleteFarcasterUserVerification(
        requestBody: RemoveVerificationReqBody,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<OperationResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/farcaster/user/verification',
            headers: {
                'api_key': apiKey,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Follow a user
     * Follow a user \
     * (In order to follow a user `signer_uuid` must be approved)
     *
     * @param requestBody
     * @param apiKey API key required for authentication.
     * @returns BulkFollowResponse Successful operation.
     * @throws ApiError
     */
    public followUser(
        requestBody: FollowReqBody,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<BulkFollowResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/farcaster/user/follow',
            headers: {
                'api_key': apiKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                404: `Resource not found`,
                500: `Server Error`,
            },
        });
    }
    /**
     * Unfollow a user
     * Unfollow a user \
     * (In order to unfollow a user `signer_uuid` must be approved)
     *
     * @param requestBody
     * @param apiKey API key required for authentication.
     * @returns BulkFollowResponse Successful operation.
     * @throws ApiError
     */
    public unfollowUser(
        requestBody: FollowReqBody,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<BulkFollowResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/farcaster/user/follow',
            headers: {
                'api_key': apiKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                404: `Resource not found`,
                500: `Server Error`,
            },
        });
    }
    /**
     * Lookup a user by custody-address
     * Lookup a user by custody-address
     * @param custodyAddress Custody Address associated with mnemonic
     * @param apiKey API key required for authentication.
     * @returns UserResponse Successful operation.
     * @throws ApiError
     */
    public lookupUserByCustodyAddress(
        custodyAddress: string,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/user/custody-address',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'custody_address': custodyAddress,
            },
            errors: {
                400: `Bad Request`,
                404: `Resource not found`,
            },
        });
    }
}
