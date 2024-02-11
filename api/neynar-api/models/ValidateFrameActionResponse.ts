/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CastWithInteractions } from './CastWithInteractions';
import type { FrameActionButton } from './FrameActionButton';
import type { User } from './User';
import type { ValidatedFrameAction } from './ValidatedFrameAction';
export type ValidateFrameActionResponse = {
    valid?: boolean;
    action?: ValidatedFrameAction;
    interactor?: User;
    button?: FrameActionButton;
    cast?: CastWithInteractions;
};

