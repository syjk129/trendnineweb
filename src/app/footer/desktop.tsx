import * as React from "react";
import { Link } from "react-router-dom";

import { LinkButton } from "../../components/button";
import { SocialIcon, SocialIconType } from "../../components/icon";
import Input, { InputType, InputVariant } from "../../components/input";

interface FooterProps {
    email: string;
    success: boolean;
    onEmailChange(email: string): void;
    submit(event): void;
}

export default class DesktopFooter extends React.Component<FooterProps> {
    render() {
        return (
            <div className="desktop-footer">
                <div className="footer" id="footer">
                    <div className="footer-content">
                        <div className="footer-column">
                            <p className="footer-title">Trendnine</p>
                            <Link className="footer-link" to="/about">About Us</Link>
                            <Link className="footer-link" to="/opportunities">I'm an Influencer</Link>
                            <Link className="footer-link" to="/terms">Terms &amp; Conditions</Link>
                            <Link className="footer-link" to="/privacy">Privacy Policy</Link>
                            <Link className="footer-link" to="/contact">Contact Us</Link>
                        </div>
                        <div className="footer-column">
                            <p className="footer-title">Follow us</p>
                            <div className="social-buttons">
                                <LinkButton href="https://www.instagram.com/trendnine/" target="_blank"><SocialIcon white icon={SocialIconType.INSTAGRAM} /></LinkButton>
                                <LinkButton href="https://www.facebook.com/trendnine" target="_blank"><SocialIcon white icon={SocialIconType.FACEBOOK} /></LinkButton>
                                <LinkButton href="https://twitter.com/trendnine" target="_blank"><SocialIcon white icon={SocialIconType.TWITTER} /></LinkButton>
                                <LinkButton href="https://www.pinterest.com/trendnine/" target="_blank"><SocialIcon white icon={SocialIconType.PINTEREST} /></LinkButton>
                            </div>
                        </div>
                        <div className="footer-disclaimer">
                            <p className="footer-title">Don't Miss Out</p>
                            <p>Get exclusive offers, inspiration, and trend updates delivered right to your inbox.</p>
                            <form onSubmit={this.props.submit}>
                                <Input
                                    variant={InputVariant.OUTLINE}
                                    placeholder="Email"
                                    value={this.props.email}
                                    onChange={this.props.onEmailChange}
                                    type={InputType.EMAIL} required={true} />
                                <Input type={InputType.SUBMIT} value="SUBSCRIBE"></Input>
                            </form>
                            {this.props.success && (<p>Subscribed!</p>)}
                            <p className="disclaimer">© 2018 TrendNine, Inc. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
