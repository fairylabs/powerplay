/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChannelListResponse } from '../models/ChannelListResponse';
import type { ChannelResponse } from '../models/ChannelResponse';
import type { UsersResponse } from '../models/UsersResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ChannelService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieve all channels with their details
     * Returns a list of all channels with their details
     * @param apiKey API key required for authentication.
     * @returns ChannelListResponse Successful response
     * @throws ApiError
     */
    public listAllChannels(
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<ChannelListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/channel/list',
            headers: {
                'api_key': apiKey,
            },
        });
    }
    /**
     * Search for channels based on id or name
     * Returns a list of channels based on id or name
     * @param q Channel ID or name for the channel being queried
     * @param apiKey API key required for authentication.
     * @returns ChannelListResponse Successful response
     * @throws ApiError
     */
    public searchChannels(
        q: string,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<ChannelListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/channel/search',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'q': q,
            },
        });
    }
    /**
     * Retrieve channel details by id
     * Returns details of a channel
     * @param id Channel ID for the channel being queried
     * @param apiKey API key required for authentication.
     * @returns ChannelResponse Successful response
     * @throws ApiError
     */
    public channelDetails(
        id: string,
        apiKey: string = 'NEYNAR_API_DOCS',
    ): CancelablePromise<ChannelResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/channel',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'id': id,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Retrieve followers for a given channel
     * Returns a list of followers for a specific channel. Max limit is 1000. Use cursor for pagination.
     * @param id Channel ID for the channel being queried
     * @param apiKey API key required for authentication.
     * @param cursor Pagination cursor.
     * @param limit Number of followers to retrieve (default 25, max 1000)
     * @returns UsersResponse Successful response
     * @throws ApiError
     */
    public channelFollowers(
        id: string,
        apiKey: string = 'NEYNAR_API_DOCS',
        cursor?: string,
        limit: number = 25,
    ): CancelablePromise<UsersResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/channel/followers',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'id': id,
                'cursor': cursor,
                'limit': limit,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Retrieve users who are active in a channel
     * Returns a list of users who are active in a given channel, ordered by ascending FIDs
     * @param id Channel ID for the channel being queried
     * @param hasRootCastAuthors Include users who posted the root cast in the channel
     * @param apiKey API key required for authentication.
     * @param hasCastLikers Include users who liked a cast in the channel
     * @param hasCastRecasters Include users who recasted a cast in the channel
     * @param hasReplyAuthors Include users who replied to a cast in the channel
     * @param cursor Pagination cursor.
     * @param limit Number of results to retrieve (default 25, max 100)
     * @returns UsersResponse Successful response
     * @throws ApiError
     */
    public channelUsers(
        id: string,
        hasRootCastAuthors: boolean,
        apiKey: string = 'NEYNAR_API_DOCS',
        hasCastLikers?: boolean,
        hasCastRecasters?: boolean,
        hasReplyAuthors?: boolean,
        cursor?: string,
        limit: number = 25,
    ): CancelablePromise<UsersResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/channel/users',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'id': id,
                'has_root_cast_authors': hasRootCastAuthors,
                'has_cast_likers': hasCastLikers,
                'has_cast_recasters': hasCastRecasters,
                'has_reply_authors': hasReplyAuthors,
                'cursor': cursor,
                'limit': limit,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Retrieve trending channels based on activity
     * Returns a list of trending channels based on activity
     * @param apiKey API key required for authentication.
     * @param timeWindow
     * @returns ChannelListResponse Successful response
     * @throws ApiError
     */
    public trendingChannels(
        apiKey: string = 'NEYNAR_API_DOCS',
        timeWindow?: '1d' | '7d' | '30d',
    ): CancelablePromise<ChannelListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/farcaster/channel/trending',
            headers: {
                'api_key': apiKey,
            },
            query: {
                'time_window': timeWindow,
            },
        });
    }
}
