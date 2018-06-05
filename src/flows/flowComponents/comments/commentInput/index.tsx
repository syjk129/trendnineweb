import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";

import { Person } from "../../../../api/models";
import WithUserSession from "../../../../app/withUserSession";
import DesktopCommentInput from "./desktop";
import MobileCommentInput from "./mobile";
import { CommentInputProps } from "./types";

import "./style.scss";

function CommentInput({ ...props }: CommentInputProps) {
    return (
        <div>
            <BrowserView device={isBrowser}>
                <DesktopCommentInput {...props} />
            </BrowserView>
            <MobileView device={isMobile}>
                <MobileCommentInput {...props} />
            </MobileView>
        </div>
    );
}

export default WithUserSession(CommentInput);
