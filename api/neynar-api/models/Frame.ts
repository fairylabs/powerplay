/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FrameActionButton } from './FrameActionButton';
export type Frame = {
    /**
     * Version of the frame
     */
    version: string;
    /**
     * URL of the image
     */
    image: string;
    buttons?: Array<FrameActionButton>;
    /**
     * Post URL to take an action on this frame
     */
    post_url?: string;
    /**
     * URL of the frames
     */
    frames_url: string;
};

