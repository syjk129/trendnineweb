import * as React from "react";
import { isTablet } from "react-device-detect";

import Button, { ButtonVariant } from "../../../components/button";
import Image from "../../../components/image";
import WelcomeProps from "./types";

import * as MobileWelcomeImage from "./mobile_welcome.png";

export default function MobileWelcome({ loggedIn, history }: WelcomeProps) {
    if (loggedIn) {
        return null;
    }

    return (
        <div className="mobile-welcome">
            <Image className="welcome-image" square={!isTablet} src={MobileWelcomeImage} />
            <div className="welcome-text">
                Welcome to TrendNine<br/><i>Shop in Style</i>
            </div>
            <div className="welcome-details">
                Follow all your favorite fashion influencers here on TrendNine, and never miss out on the next hottest outfits.
            </div>
            <div className="welcome-buttons">
                <Button
                    className="join"
                    inline
                    white
                    rounded
                    variant={ButtonVariant.SECONDARY}
                    onClick={() => history.push("/discover/login")}
                >
                    Join
                </Button>
                <Button
                    inline
                    white
                    rounded
                    variant={ButtonVariant.OUTLINE}
                    onClick={() => history.push("/about")}
                >
                    Learn More
                </Button>
            </div>
        </div>
    );
}
