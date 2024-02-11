/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Fid } from '../models/Fid';
import type { NotificationsResponse } from '../models/NotificationsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class NotificationsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieve notifications for a given user
     * Returns a list of notifications for a specific FID.
     * @param fid FID of the user you you want to fetch notifications for
     * @param apiKey API key required for authentication.
     * @param limit Number of results to retrieve (default 25, max 50)
     * @param cursor Pagination cursor.
     * @returns NotificationsResponse Successful response
     * @throws ApiError
     */
    public notifications(
        fid: Fid,
        apiKey: string = 'NEYNAR_API_DOCS',
        limit: number = 25,
        cursor?: string,
    ): CancelablePromise<NotificationsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/notifications',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'fid': fid,
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Retrieve notifications for a user in given channels
     * Returns a list of notifications for a user in specific channels
     * @param fid FID of the user you you want to fetch notifications for
     * @param channelIds Comma separated channel_ids (find list of all channels here - https://docs.neynar.com/reference/list-all-channels)
     * @param apiKey API key required for authentication.
     * @param limit Number of results to retrieve (default 25, max 50)
     * @param cursor Pagination cursor.
     * @returns NotificationsResponse Successful response
     * @throws ApiError
     */
    public notificationsChannel(
        fid: Fid,
        channelIds: string,
        apiKey: string = 'NEYNAR_API_DOCS',
        limit: number = 25,
        cursor?: string,
    ): CancelablePromise<NotificationsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/notifications/channel',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'fid': fid,
                'channel_ids': channelIds,
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Retrieve notifications for a user in given parent_urls
     * Returns a list of notifications for a user in specific parent_urls
     * @param fid FID of the user you you want to fetch notifications for
     * @param parentUrls Comma separated parent_urls
     * @param apiKey API key required for authentication.
     * @param limit Number of results to retrieve (default 25, max 50)
     * @param cursor Pagination cursor.
     * @returns NotificationsResponse Successful response
     * @throws ApiError
     */
    public notificationsParentUrl(
        fid: Fid,
        parentUrls: string,
        apiKey: string = 'NEYNAR_API_DOCS',
        limit: number = 25,
        cursor?: string,
    ): CancelablePromise<NotificationsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/notifications/parent_url',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'fid': fid,
                'parent_urls': parentUrls,
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
