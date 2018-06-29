import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
import { withRouter } from "react-router-dom";

import WithUserSession from "../withUserSession";
import DesktopHeader from "./desktop";
import MobileHeader from "./mobile";
import { HeaderProps } from "./types";

import "./style.scss";

class Header extends React.Component<HeaderProps> {
    render() {
        return (
            <div>
                <BrowserView device={isBrowser}>
                    <DesktopHeader {...this.props} />
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobileHeader {...this.props} />
                </MobileView>
            </div>
        );
    }
}

export default withRouter(WithUserSession(Header));
