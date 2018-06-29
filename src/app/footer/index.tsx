import * as React from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";

import { SocialIcon, SocialIconType } from "../../components/icon";
import RouteProps from "../../flows/routeProps";
import * as Logo from "../logo.png";
import "./style.scss";

type Props = RouteProps;
export default class Footer extends React.Component<Props> {
    render() {
        if (isMobile) return null;
        const isShop = this.props.location.pathname === "/shop";

        return (
            <div className="footer" id="footer">
                <div className="footer-logo">
                    <Link className="nav-logo-container" to={isShop ? "/shop/home" : "/discover"}><img className="nav-logo" src={Logo} /></Link>
                </div>
                <div className="footer-content">
                    <div className="footer-column">
                        <p className="footer-title">Trendnine</p>
                        <Link className="footer-link" to="/about">About us</Link>
                        <Link className="footer-link" to="/opportunities">I'm an Influencer</Link>
                        <Link className="footer-link" to="/legal">Terms & Privacy</Link>
                        <Link className="footer-link" to="/contact">Contact us</Link>
                    </div>
                    <div className="footer-column">
                        <p className="footer-title">Help us improve</p>
                        <Link className="footer-link" to="/survey">Start a survey</Link>
                    </div>
                    <div className="footer-disclaimer">
                        <p className="footer-title">Follow us</p>
                        <SocialIcon icon={SocialIconType.INSTAGRAM} />
                        <SocialIcon icon={SocialIconType.FACEBOOK} />
                        <SocialIcon icon={SocialIconType.TWITTER} />
                        <SocialIcon icon={SocialIconType.PINTEREST} />
                        <p className="disclaimer">© 2018 TrendNine, Inc. All rights reserved.</p>
                    </div>
                </div>
            </div>
        );
    }
}
