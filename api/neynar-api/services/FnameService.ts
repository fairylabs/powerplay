/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FnameAvailabilityResponse } from '../models/FnameAvailabilityResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class FnameService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Check if a given fname is available
     * Check if a given fname is available
     * @param fname
     * @param apiKey API key required for authentication.
     * @returns FnameAvailabilityResponse Successful operation.
     * @throws ApiError
     */
    public fnameAvailability(
        fname: string,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<FnameAvailabilityResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/fname/availability',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'fname': fname,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
