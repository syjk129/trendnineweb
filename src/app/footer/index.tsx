import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";

import { AppContext } from "../../app";
import Button, { ButtonSize, LinkButton } from "../../components/button";
import { SocialIcon, SocialIconType } from "../../components/icon";
import Input, { InputType, InputVariant } from "../../components/input";
import RouteProps from "../../flows/routeProps";
import * as Logo from "../logo.png";
import "./style.scss";

type Props = RouteProps;

interface FooterState {
    email: string;
    success: boolean;
}

export default class Footer extends React.Component<Props, FooterState> {
    static contextTypes: AppContext;

    state: FooterState = {
        email: "",
        success: false,
    };

    render() {
        if (isMobile) return null;
        const isShop = this.props.location.pathname.indexOf("/shop") > -1;

        return (
            <div className="footer-container">
                <div className="footer" id="footer">
                    <div className="footer-logo">
                    </div>
                    <div className="footer-content">
                        <div className="footer-column">
                            <p className="footer-title">Trendnine</p>
                            <Link className="footer-link" to={isShop ? "/shop/about" : "/about"}>About Us</Link>
                            <Link className="footer-link" to={isShop ? "/shop/opportunities" : "/opportunities"}>I'm an Influencer</Link>
                            <Link className="footer-link" to={isShop ? "/shop/terms" : "/terms"}>Terms &amp; Conditions</Link>
                            <Link className="footer-link" to={isShop ? "/shop/privacy" : "/privacy"}>Privacy Policy</Link>
                            <Link className="footer-link" to={isShop ? "/shop/contact" : "/contact"}>Contact Us</Link>
                        </div>
                        <div className="footer-column">
                            <p className="footer-title">Follow us</p>
                            <div className="social-buttons">
                                <LinkButton href="https://www.instagram.com/trendnine/" target="_blank"><SocialIcon icon={SocialIconType.INSTAGRAM} /></LinkButton>
                                <LinkButton href="https://www.facebook.com/trendnine" target="_blank"><SocialIcon icon={SocialIconType.FACEBOOK} /></LinkButton>
                                <LinkButton href="https://twitter.com/trendnine" target="_blank"><SocialIcon icon={SocialIconType.TWITTER} /></LinkButton>
                                <LinkButton href="https://www.pinterest.com/trendnine/" target="_blank"><SocialIcon icon={SocialIconType.PINTEREST} /></LinkButton>
                            </div>
                        </div>
                        <div className="footer-disclaimer">
                            <p className="footer-title">Don't Miss Out</p>
                            <p>Get exclusive offers, inspiration, and trend updates delivered right to your inbox.</p>
                            <form onSubmit={this._onSubmit}>
                                <Input
                                    variant={InputVariant.OUTLINE}
                                    placeholder="Email"
                                    value={this.state.email}
                                    onChange={this._onInputChange}
                                    type={InputType.EMAIL} required={true} />
                                <Input type={InputType.SUBMIT} value="SUBSCRIBE"></Input>
                            </form>
                            {this.state.success && (<p>Subscribed!</p>)}
                            <p className="disclaimer">© 2018 TrendNine, Inc. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    @autobind
    private _onInputChange(email: string) {
        this.setState({ email });
    }

    @autobind
    private async _onSubmit(event) {
        event.preventDefault();
        try {
            const response = await this.context.api.subscribe(this.state);
            if (response.result.email) {
                this.setState({email: "", success: true});
                setTimeout(function() {
                    this.setState({success: false});
                }.bind(this), 5000);
            }
        } catch (err) {
            this.setState({ email: "", success: true});
            setTimeout(function() {
                this.setState({success: false});
            }.bind(this), 5000);
        }
        return false;
    }
}

Footer.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
