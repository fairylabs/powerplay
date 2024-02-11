/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CastParamType } from '../models/CastParamType';
import type { CastResponse } from '../models/CastResponse';
import type { CastsResponse } from '../models/CastsResponse';
import type { DeleteCastReqBody } from '../models/DeleteCastReqBody';
import type { Fid } from '../models/Fid';
import type { OperationResponse } from '../models/OperationResponse';
import type { PostCastReqBody } from '../models/PostCastReqBody';
import type { PostCastResponse } from '../models/PostCastResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CastService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieve cast for a given hash or Warpcast URL
     * Gets information about an individual cast by passing in a Warpcast web URL or cast hash
     * @param identifier Cast identifier (Its either a url or a hash)
     * @param type
     * @param apiKey API key required for authentication.
     * @returns CastResponse Successful operation.
     * @throws ApiError
     */
    public cast(
        identifier: string,
        type: CastParamType,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<CastResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/cast',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'identifier': identifier,
                'type': type,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Posts a cast
     * Posts a cast or cast reply. Works with mentions and embeds.
     * (In order to post a cast `signer_uuid` must be approved)
     *
     * @param requestBody
     * @param apiKey API key required for authentication.
     * @returns PostCastResponse Successful operation.
     * @throws ApiError
     */
    public postCast(
        requestBody: PostCastReqBody,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<PostCastResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/farcaster/cast',
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
     * Delete a cast
     * Delete an existing cast. \
     * (In order to delete a cast `signer_uuid` must be approved)
     *
     * @param requestBody
     * @param apiKey API key required for authentication.
     * @returns OperationResponse Successful operation.
     * @throws ApiError
     */
    public deleteCast(
        requestBody: DeleteCastReqBody,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<OperationResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/farcaster/cast',
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
     * Gets information about an array of casts
     * Retrieve multiple casts using their respective hashes.
     * @param casts Hashes of the cast to be retrived (Comma separated)
     * @param apiKey API key required for authentication.
     * @param viewerFid adds viewer_context to cast object to show whether viewer has liked or recasted the cast.
     * @param sortType Optional parameter to sort the casts based on different criteria
     * @returns CastsResponse Successful operation.
     * @throws ApiError
     */
    public casts(
        casts: string,
        apiKey: string = 'NEYNAR_API_DOCS',
        viewerFid?: Fid,
        sortType?: 'trending' | 'likes' | 'recasts' | 'replies' | 'recent',
    ): CancelablePromise<CastsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/casts',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'casts': casts,
                'viewer_fid': viewerFid,
                'sort_type': sortType,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
