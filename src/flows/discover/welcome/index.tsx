import * as React from "react";
import { isMobile, isTablet } from "react-device-detect";

import DesktopWelcome from "./desktop";
import MobileWelcome from "./mobile";
import WelcomeProps from "./types";

export default function Welcome(props: WelcomeProps) {
    if (isTablet) {
        return null;
    }
    if (isMobile) {
        return <MobileWelcome {...props} />;
    } else {
        return <DesktopWelcome {...props} />;
    }
}
