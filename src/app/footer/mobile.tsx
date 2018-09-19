import * as React from "react";
import { Link } from "react-router-dom";
import * as LogoWhite from "../logo_white.png";

import { SocialIcon, SocialIconType } from "../../components/icon";
import Image from "../../components/image";

interface FooterProps {
    email: string;
    success: boolean;
    onEmailChange(email: string): void;
    submit(event): void;
}

export default function MobileFooter({ email, success, onEmailChange, submit }: FooterProps) {
    return (
        <div className="mobile-footer">
            <div className="follow-us-text">
                Follow us on
            </div>
            <div className="follow-us-buttons">
                <SocialIcon icon={SocialIconType.PINTEREST} white />
                <SocialIcon icon={SocialIconType.FACEBOOK} white />
                <SocialIcon icon={SocialIconType.INSTAGRAM} white />
            </div>
            <Link className="footer-link" to="/about">About Us</Link>
            <Link className="footer-link" to="/opportunities">I'm an Influencer</Link>
            <Link className="footer-link" to="/terms">Terms &amp; Conditions</Link>
            <Link className="footer-link" to="/privacy">Privacy Policy</Link>
            <Link className="footer-link" to="/contact">Contact Us</Link>
            <Image className="footer-logo" src={LogoWhite} />
            <div className="copyright">©TrendNine All Rights Reserved</div>
        </div>
    );
}
