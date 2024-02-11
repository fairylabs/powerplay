/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FrameActionButton } from './FrameActionButton';
export type FrameAction = {
    version?: string;
    title?: string;
    image?: string;
    button: FrameActionButton;
    /**
     * Text input for the frame
     */
    text_input?: string;
    /**
     * URL of the frames
     */
    frames_url: string;
    /**
     * URL of the post to get the next frame
     */
    post_url: string;
};

