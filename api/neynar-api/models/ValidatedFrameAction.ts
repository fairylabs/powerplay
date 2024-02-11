/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CastWithInteractions } from "./CastWithInteractions";
import type { FrameActionButton } from "./FrameActionButton";
import type { User } from "./User";
export type ValidatedFrameAction = {
    object?: ValidatedFrameAction.OBJ;
    interactor: User;
    button: FrameActionButton;
    cast: CastWithInteractions;
};
export namespace ValidatedFrameAction {
    export enum OBJ {
        VALIDATED_FRAME_ACTION = "validated_frame_action",
    }
}
