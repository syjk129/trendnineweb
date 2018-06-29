import * as React from "react";

import * as FacebookIcon from "./icons/facebook.png";
import * as InstagramIcon from "./icons/instagram.png";
import * as PinterestIcon from "./icons/pinterest.png";
import * as TwitterIcon from "./icons/twitter.png";

import { SocialIconType } from "./types";

interface SocialIconProps {
    icon: SocialIconType;
}

export default function SocialIcon({ icon }: SocialIconProps) {
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
