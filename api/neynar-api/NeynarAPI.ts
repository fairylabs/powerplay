/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { CastService } from './services/CastService';
import { ChannelService } from './services/ChannelService';
import { FeedService } from './services/FeedService';
import { FnameService } from './services/FnameService';
import { FollowsService } from './services/FollowsService';
import { FrameService } from './services/FrameService';
import { NotificationsService } from './services/NotificationsService';
import { ReactionService } from './services/ReactionService';
import { SignerService } from './services/SignerService';
import { StorageService } from './services/StorageService';
import { UserService } from './services/UserService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class NeynarAPI {
    public readonly cast: CastService;
    public readonly channel: ChannelService;
    public readonly feed: FeedService;
    public readonly fname: FnameService;
    public readonly follows: FollowsService;
    public readonly frame: FrameService;
    public readonly notifications: NotificationsService;
    public readonly reaction: ReactionService;
    public readonly signer: SignerService;
    public readonly storage: StorageService;
    public readonly user: UserService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? 'https://api.neynar.com/v2',
            VERSION: config?.VERSION ?? '2.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.cast = new CastService(this.request);
        this.channel = new ChannelService(this.request);
        this.feed = new FeedService(this.request);
        this.fname = new FnameService(this.request);
        this.follows = new FollowsService(this.request);
        this.frame = new FrameService(this.request);
        this.notifications = new NotificationsService(this.request);
        this.reaction = new ReactionService(this.request);
        this.signer = new SignerService(this.request);
        this.storage = new StorageService(this.request);
        this.user = new UserService(this.request);
    }
}

