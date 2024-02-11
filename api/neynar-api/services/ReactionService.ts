/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Fid } from '../models/Fid';
import type { OperationResponse } from '../models/OperationResponse';
import type { ReactionReqBody } from '../models/ReactionReqBody';
import type { ReactionsResponse } from '../models/ReactionsResponse';
import type { ReactionsType } from '../models/ReactionsType';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ReactionService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Posts a reaction
     * Post a reaction (like or recast) to a given cast \
     * (In order to post a reaction `signer_uuid` must be approved)
     *
     * @param requestBody
     * @param apiKey API key required for authentication.
     * @returns OperationResponse Successful operation.
     * @throws ApiError
     */
    public postReaction(
        requestBody: ReactionReqBody,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<OperationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/farcaster/reaction',
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
     * Delete a reaction
     * Delete a reaction (like or recast) to a given cast \
     * (In order to delete a reaction `signer_uuid` must be approved)
     *
     * @param requestBody
     * @param apiKey API key required for authentication.
     * @returns OperationResponse Successful operation.
     * @throws ApiError
     */
    public deleteReaction(
        requestBody: ReactionReqBody,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<OperationResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/farcaster/reaction',
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
     * Fetches reactions for a given user
     * Fetches reactions for a given user
     * @param fid
     * @param type Type of reaction to fetch (likes or recasts or all)
     * @param apiKey API key required for authentication.
     * @param limit Number of results to retrieve (default 25, max 100)
     * @param cursor Pagination cursor.
     * @returns ReactionsResponse Successful operation.
     * @throws ApiError
     */
    public reactionsUser(
        fid: Fid,
        type: ReactionsType,
        apiKey: string = 'NEYNAR_API_DOCS',
        limit: number = 25,
        cursor?: string,
    ): CancelablePromise<ReactionsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/reactions/user',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'fid': fid,
                'type': type,
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
