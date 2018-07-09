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
}

export default function SocialIcon({ icon, white }: SocialIconProps) {
    if (white) {
        switch (icon) {
            case SocialIconType.FACEBOOK:
                return <img className="social-icon" src={WhiteFacebookIcon} />;
            case SocialIconType.TWITTER:
                return <img className="social-icon" src={WhiteTwitterIcon} />;
            case SocialIconType.INSTAGRAM:
                return <img className="social-icon" src={WhiteInstagramIcon} />;
            case SocialIconType.PINTEREST:
                return <img className="social-icon" src={WhitePinterestIcon} />;
        }
    }

    switch (icon) {
        case SocialIconType.FACEBOOK:
            return <img className="social-icon" src={FacebookIcon} />;
        case SocialIconType.TWITTER:
            return <img className="social-icon" src={TwitterIcon} />;
        case SocialIconType.INSTAGRAM:
            return <img className="social-icon" src={InstagramIcon} />;
        case SocialIconType.PINTEREST:
            return <img className="social-icon" src={PinterestIcon} />;
    }
}
