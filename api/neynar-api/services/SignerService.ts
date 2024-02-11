/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RegisterSignerKeyReqBody } from '../models/RegisterSignerKeyReqBody';
import type { Signer } from '../models/Signer';
import type { SignerUUID } from '../models/SignerUUID';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SignerService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Fetches the status of a signer
     * Gets information status of a signer by passing in a signer_uuid (Use post API to generate a signer)
     * @param signerUuid
     * @param apiKey API key required for authentication.
     * @returns Signer Successful operation.
     * @throws ApiError
     */
    public signer(
        signerUuid: SignerUUID,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<Signer> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/signer',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'signer_uuid': signerUuid,
            },
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                404: `Resource not found`,
                500: `Server Error`,
            },
        });
    }
    /**
     * Creates a signer and returns the signer status
     * Creates a signer and returns the signer status. \
     * **Note**: While tesing please reuse the signer, it costs money to approve a signer.
     *
     * @param apiKey API key required for authentication.
     * @returns Signer Successful operation.
     * @throws ApiError
     */
    public createSigner(
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<Signer> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/farcaster/signer',
            headers: {
                'api_key': apiKey,
            },
            errors: {
                500: `Server Error`,
            },
        });
    }
    /**
     * Register Signed Key
     * Registers an app fid, deadline and a signature. Returns the signer status with an approval url.
     * @param requestBody
     * @param apiKey API key required for authentication.
     * @returns Signer Successful operation
     * @throws ApiError
     */
    public registerSignedKey(
        requestBody: RegisterSignerKeyReqBody,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<Signer> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/farcaster/signer/signed_key',
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
}
