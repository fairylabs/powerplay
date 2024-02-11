/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkCastsResponse } from "../models/BulkCastsResponse";
import type { FeedResponse } from "../models/FeedResponse";
import { FeedType } from "../models/FeedType";
import type { Fid } from "../models/Fid";
import type { FilterType } from "../models/FilterType";
import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";
export class FeedService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieve casts based on filters
     * @param apiKey API key required for authentication.
     * @param feedType Defaults to following (requires fid or address). If set to filter (requires filter_type)
     * @param filterType Used when feed_type=filter. Can be set to fids (requires fids) or parent_url (requires parent_url) or channel_id (requires channel_id)
     * @param fid (Optional) fid of user whose feed you want to create. By default, the API expects this field, except if you pass a filter_type
     * @param fids Used when filter_type=fids . Create a feed based on a list of fids. Max array size is 250. Requires feed_type and filter_type.
     * @param parentUrl Used when filter_type=parent_url can be used to fetch content under any parent url e.g. FIP-2 channels on Warpcast. Requires feed_type and filter_type
     * @param channelId Used when filter_type=channel_id can be used to fetch all casts under a channel. Requires feed_type and filter_type
     * @param embedUrl Used when filter_type=embed_url can be used to fetch all casts with an embed url that contains embed_url. Requires feed_type and filter_type
     * @param withRecasts Include recasts in the response, true by default
     * @param withReplies Include replies in the response, false by default
     * @param limit Number of results to retrieve (default 25, max 100)
     * @param cursor Pagination cursor.
     * @returns FeedResponse Successful operation.
     * @throws ApiError
     */
    public feed(
        apiKey: string = "NEYNAR_API_DOCS",
        feedType: FeedType = FeedType.FOLLOWING,
        filterType?: FilterType,
        fid?: Fid,
        fids?: string,
        parentUrl?: string,
        channelId?: string,
        embedUrl?: string,
        withRecasts: boolean = true,
        withReplies: boolean = false,
        limit: number = 25,
        cursor?: string,
    ): CancelablePromise<FeedResponse> {
        return this.httpRequest.request({
            method: "GET",
            url: "/farcaster/feed",
            headers: {
                api_key: apiKey,
            },
            query: {
                feed_type: feedType,
                filter_type: filterType,
                fid: fid,
                fids: fids,
                parent_url: parentUrl,
                channel_id: channelId,
                embed_url: embedUrl,
                with_recasts: withRecasts,
                with_replies: withReplies,
                limit: limit,
                cursor: cursor,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Retrieve feed based on who a user is following
     * @param fid fid of user whose feed you want to create
     * @param apiKey API key required for authentication.
     * @param withRecasts Include recasts in the response, true by default
     * @param withReplies Include replies in the response, false by default
     * @param limit Number of results to retrieve (default 25, max 100)
     * @param cursor Pagination cursor.
     * @returns FeedResponse Successful operation.
     * @throws ApiError
     */
    public feedFollowing(
        fid: Fid,
        apiKey: string = "NEYNAR_API_DOCS",
        withRecasts: boolean = true,
        withReplies: boolean = false,
        limit: number = 25,
        cursor?: string,
    ): CancelablePromise<FeedResponse> {
        return this.httpRequest.request({
            method: "GET",
            url: "/farcaster/feed/following",
            headers: {
                api_key: apiKey,
            },
            query: {
                fid: fid,
                with_recasts: withRecasts,
                with_replies: withReplies,
                limit: limit,
                cursor: cursor,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Retrieve feed based on channel ids
     * @param channelIds comma separated list of channel ids e.g. neynar,farcaster
     * @param apiKey API key required for authentication.
     * @param withRecasts Include recasts in the response, true by default
     * @param withReplies Include replies in the response, false by default
     * @param limit Number of results to retrieve (default 25, max 100)
     * @param cursor Pagination cursor.
     * @returns FeedResponse Successful operation.
     * @throws ApiError
     */
    public feedChannels(
        channelIds: string,
        apiKey: string = "NEYNAR_API_DOCS",
        withRecasts: boolean = true,
        withReplies: boolean = false,
        limit: number = 25,
        cursor?: string,
    ): CancelablePromise<FeedResponse> {
        return this.httpRequest.request({
            method: "GET",
            url: "/farcaster/feed/channels",
            headers: {
                api_key: apiKey,
            },
            query: {
                channel_ids: channelIds,
                with_recasts: withRecasts,
                with_replies: withReplies,
                limit: limit,
                cursor: cursor,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Retrieve feed of casts with Frames, reverse chronological order
     * @param apiKey API key required for authentication.
     * @param limit Number of results to retrieve (default 25, max 100)
     * @param cursor Pagination cursor.
     * @returns FeedResponse Successful operation.
     * @throws ApiError
     */
    public feedFrames(
        apiKey: string = "NEYNAR_API_DOCS",
        limit: number = 25,
        cursor?: string,
    ): CancelablePromise<FeedResponse> {
        return this.httpRequest.request({
            method: "GET",
            url: "/farcaster/feed/frames",
            headers: {
                api_key: apiKey,
            },
            query: {
                limit: limit,
                cursor: cursor,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Retrieve 10 most popular casts for a user
     * Retrieve 10 most popular casts for a given user FID; popularity based on replies, likes and recasts; sorted by most popular first
     * @param fid fid of user whose feed you want to create
     * @param apiKey API key required for authentication.
     * @returns BulkCastsResponse Successful operation.
     * @throws ApiError
     */
    public feedUserPopular(
        fid: Fid,
        apiKey: string = "NEYNAR_API_DOCS",
    ): CancelablePromise<BulkCastsResponse> {
        return this.httpRequest.request({
            method: "GET",
            url: "/farcaster/feed/user/{fid}/popular",
            path: {
                fid: fid,
            },
            headers: {
                api_key: apiKey,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Retrieve recent replies and recasts for a user
     * Retrieve recent replies and recasts for a given user FID; sorted by most recent first
     * @param fid fid of user whose replies and recasts you want to fetch
     * @param apiKey API key required for authentication.
     * @param limit Number of results to retrieve (default 25, max 100)
     * @param cursor Pagination cursor.
     * @returns FeedResponse Successful operation.
     * @throws ApiError
     */
    public feedUserRepliesRecasts(
        fid: Fid,
        apiKey: string = "NEYNAR_API_DOCS",
        limit: number = 25,
        cursor?: string,
    ): CancelablePromise<FeedResponse> {
        return this.httpRequest.request({
            method: "GET",
            url: "/farcaster/feed/user/{fid}/replies_and_recasts",
            path: {
                fid: fid,
            },
            headers: {
                api_key: apiKey,
            },
            query: {
                limit: limit,
                cursor: cursor,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
