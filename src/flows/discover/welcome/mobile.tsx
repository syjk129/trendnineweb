import * as React from "react";

import Button, { ButtonSize, ButtonVariant } from "../../../components/button";
import Image from "../../../components/image";
import WelcomeProps from "./types";

import * as MobileWelcomeImage from "./mobile_welcome.png";

export default function MobileWelcome({ loggedIn, location, match, history }: WelcomeProps) {
    if (loggedIn) {
        return null;
    }

    return (
        <div className="mobile-welcome">
            <Image src={MobileWelcomeImage} />
            <div className="welcome-text">
                Welcome to TrendNine,<br/>Shop in Style.
            </div>
            <div className="welcome-details">
                Shop the best looks from fashion influencers you love most right from your homepage, social media, or inbox.
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
