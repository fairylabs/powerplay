/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Fid } from '../models/Fid';
import type { RelevantFollowersResponse } from '../models/RelevantFollowersResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class FollowsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieve relevant followers for a given user
     * Returns a list of relevant followers for a specific FID.
     * @param targetFid User who's profile you are looking at
     * @param viewerFid Viewer who's looking at the profile
     * @param apiKey API key required for authentication.
     * @returns RelevantFollowersResponse Successful response
     * @throws ApiError
     */
    public relevantFollowers(
        targetFid: Fid,
        viewerFid: Fid,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<RelevantFollowersResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/followers/relevant',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'target_fid': targetFid,
                'viewer_fid': viewerFid,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
