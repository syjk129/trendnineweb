import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";

import { AppContext } from "../../app";
import Button, { ButtonSize } from "../../components/button";
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
            <div className="footer" id="footer">
                <div className="footer-logo">
                    <Link className="nav-logo-container" to={isShop ? "/shop/home" : "/discover"}><img className="nav-logo" src={Logo} /></Link>
                </div>
                <div className="footer-content">
                    <div className="footer-column">
                        <p className="footer-title">Trendnine</p>
                        <Link className="footer-link" to={isShop ? "/shop/about" : "/about"}>About us</Link>
                        <Link className="footer-link" to={isShop ? "/shop/opportunities" : "/opportunities"}>I'm an Influencer</Link>
                        <Link className="footer-link" to={isShop ? "/shop/terms" : "/terms"}>Terms &amp; Conditions</Link>
                        <Link className="footer-link" to={isShop ? "/shop/privacy" : "/privacy"}>Privacy Policy</Link>
                        <Link className="footer-link" to={isShop ? "/shop/contact" : "/contact"}>Contact us</Link>
                    </div>
                    <div className="footer-column">
                        <p className="footer-title">Follow us</p>
                        <SocialIcon icon={SocialIconType.INSTAGRAM} />
                        <SocialIcon icon={SocialIconType.FACEBOOK} />
                        <SocialIcon icon={SocialIconType.TWITTER} />
                        <SocialIcon icon={SocialIconType.PINTEREST} />
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
        );
    }

    @autobind
    private _onInputChange(email: string) {
        this.setState({ email });
    }

    @autobind
    private async _onSubmit(event) {
        event.preventDefault();
        const response = await this.context.api.subscribe(this.state);
        if (response.email) {
            this.setState({email: "", success: true});
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
