/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FrameActionReqBody } from '../models/FrameActionReqBody';
import type { FrameActionResponse } from '../models/FrameActionResponse';
import type { ValidateFrameActionResponse } from '../models/ValidateFrameActionResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class FrameService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Posts a frame action
     * Post a frame action \
     * (In order to post a frame action `signer_uuid` must be approved)
     *
     * @param requestBody
     * @param apiKey API key required for authentication.
     * @returns FrameActionResponse Successful operation.
     * @throws ApiError
     */
    public postFrameAction(
        requestBody: FrameActionReqBody,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<FrameActionResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/farcaster/frame/action',
            headers: {
                'api_key': apiKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }
    /**
     * Validates a frame action against Farcaster Hub
     * Validates a frame against by an interacting user against a Farcaster Hub \
     * (In order to validate a frame, message bytes from Frame Action must be provided in hex)
     *
     * @param requestBody
     * @param apiKey API key required for authentication.
     * @returns ValidateFrameActionResponse Successful operation.
     * @throws ApiError
     */
    public validateFrame(
        requestBody: {
            /**
             * Hexadecimal string of message bytes.
             */
            message_bytes_in_hex: string;
            /**
             * Adds viewer_context inside the cast object to indicate whether the interactor reacted to the cast housing the frame.
             */
            cast_reaction_context?: boolean;
            /**
             * Adds viewer_context inside the user (interactor) object to indicate whether the interactor follows or is followed by the cast author.
             */
            follow_context?: boolean;
        },
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<ValidateFrameActionResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/farcaster/frame/validate',
            headers: {
                'api_key': apiKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }
}
