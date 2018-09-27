import * as React from "react";

import * as FacebookIcon from "./icons/facebook.png";
import * as InstagramIcon from "./icons/instagram.png";
import * as PinterestIcon from "./icons/pinterest.png";
import * as TwitterIcon from "./icons/twitter.png";

import * as WhiteFacebookIcon from "./icons/facebook_white.png";
import * as WhiteInstagramIcon from "./icons/instagram_white.png";
import * as WhitePinterestIcon from "./icons/pinterest_white.png";
import * as WhiteTwitterIcon from "./icons/twitter_white.png";

import { SocialIconType } from "./types";

interface SocialIconProps {
    icon: SocialIconType;
    white?: boolean;
    large?: boolean;
}

export default function SocialIcon({ icon, large, white }: SocialIconProps) {
    let classes = "social-icon";
    if (large) {
        classes += " large";
    }

    if (white) {
        switch (icon) {
            case SocialIconType.FACEBOOK:
                return <img className={classes} src={WhiteFacebookIcon} />;
            case SocialIconType.TWITTER:
                return <img className={classes} src={WhiteTwitterIcon} />;
            case SocialIconType.INSTAGRAM:
                return <img className={classes} src={WhiteInstagramIcon} />;
            case SocialIconType.PINTEREST:
                return <img className={classes} src={WhitePinterestIcon} />;
        }
    }

    switch (icon) {
        case SocialIconType.FACEBOOK:
            return <img className={classes} src={FacebookIcon} />;
        case SocialIconType.TWITTER:
            return <img className={classes} src={TwitterIcon} />;
        case SocialIconType.INSTAGRAM:
            return <img className={classes} src={InstagramIcon} />;
        case SocialIconType.PINTEREST:
            return <img className={classes} src={PinterestIcon} />;
    }
}
