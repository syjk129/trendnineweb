import autobind from "autobind-decorator";
import * as H from "history";
import * as React from "react";
import { Link, withRouter } from "react-router-dom";

import { LinkButton } from "../../../components/button";
import Icon, { IconVariant, SocialIcon, SocialIconType } from "../../../components/icon";
import Input, { InputTheme, InputType, InputVariant } from "../../../components/input";
import * as LogoWhite from "../../logo_white.png";

import "./style.scss";

interface MenuProps {
    open: boolean;
    isShop: boolean;
    loggedIn: boolean;
    location: any;
    history: H.History;
    toggleMenu(): void;
    subscribe(email: any): Promise<any>;
}

interface MenuState {
    subscribeEmail: string;
    success: boolean;
    fail: boolean;
}

class Menu extends React.Component<MenuProps, MenuState> {
    state: MenuState = {
        subscribeEmail: "",
        success: false,
        fail: false,
    };

    componentWillMount() {
        this._menuRef = React.createRef();
    }

    componentWillReceiveProps(nextProps: MenuProps) {
        if (this.props.open !== nextProps.open) {
            const menu = this._menuRef.current;
            if (nextProps.open) {
                menu.style.width = "calc(100%)";
            } else {
                menu.style.width = "0";
            }
        }
    }

    render() {
        const { isShop, loggedIn } = this.props;

        return (
            <div className="menu-container" ref={this._menuRef}>
                <div className="menu">
                    <div className="menu-header">
                        <span className="close" onClick={this.props.toggleMenu}>&times;</span>
                        <Link to={isShop ? "/shop" : "/discover"}>
                            <img
                                className="nav-logo"
                                src={LogoWhite}
                                onClick={this.props.toggleMenu}
                            />
                        </Link>
                        <span />
                    </div>
                    <div className="menu-content">
                        <LinkButton
                            className="menu-link"
                            showSelected
                            to={isShop ? "/shop/discover" : "/discover"}
                            onClick={this.props.toggleMenu}
                        >
                            Trending
                        </LinkButton>
                        <LinkButton
                            className="menu-link"
                            showSelected
                            to={isShop ? "/shop/feed" : "/feed"}
                            onClick={this.props.toggleMenu}
                        >
                            Feed
                        </LinkButton>
                        <LinkButton
                            className="menu-link"
                            showSelected
                            to={isShop ? "/shop/brands" : "/brands"}
                            onClick={this.props.toggleMenu}
                        >
                        Brands
                        </LinkButton>
                        <div className="menu-divider" />
                        <LinkButton
                            className="menu-link"
                            showSelected
                            to={isShop ? "/shop/category/clothing" : "/discover/category/clothing"}
                            onClick={this.props.toggleMenu}
                        >
                            Clothing
                        </LinkButton>
                        <LinkButton
                            className="menu-link"
                            showSelected
                            to={isShop ? "/shop/category/shoes" : "/discover/category/shoes"}
                            onClick={this.props.toggleMenu}
                        >
                            Shoes
                        </LinkButton>
                        <LinkButton
                            className="menu-link"
                            showSelected
                            to={isShop ? "/shop/category/bags" : "/discover/category/bags"}
                            onClick={this.props.toggleMenu}
                        >
                            Bags
                        </LinkButton>
                        <LinkButton
                            className="menu-link"
                            showSelected
                            to={isShop ? "/shop/category/accessories" : "/discover/category/accessories"}
                            onClick={this.props.toggleMenu}
                        >
                            Accessories
                        </LinkButton>
                        <div className="menu-divider" />
                        {loggedIn && (
                            <>
                                <LinkButton className="menu-link" onClick={this._logout}>
                                    Sign Out
                                </LinkButton>
                                <div className="menu-divider" />
                            </>
                        )}
                        <LinkButton
                            className="menu-link"
                            showSelected
                            to={isShop ? "/shop/about" : "/about"}
                            onClick={this.props.toggleMenu}
                        >
                            About Us
                        </LinkButton>
                        <LinkButton
                            className="menu-link"
                            showSelected
                            to={isShop ? "/shop/opportunities" : "/opportunities"}
                            onClick={this.props.toggleMenu}
                        >
                            I'm an Influencer
                        </LinkButton>
                        <LinkButton
                            className="menu-link"
                            showSelected
                            to={isShop ? "/shop/terms" : "/terms"}
                            onClick={this.props.toggleMenu}
                        >
                            Terms &amp; Conditions
                        </LinkButton>
                        <LinkButton
                            className="menu-link"
                            showSelected
                            to={isShop ? "/shop/privacy" : "/privacy"}
                            onClick={this.props.toggleMenu}
                        >
                            Privacy Policy
                        </LinkButton>
                        <LinkButton
                            className="menu-link"
                            showSelected
                            to={isShop ? "/shop/contact" : "/contact"}
                            onClick={this.props.toggleMenu}
                        >
                            Contact Us
                        </LinkButton>
                        <div className="menu-divider" />
                        <div className="social-icons">
                            <LinkButton href="https://www.instagram.com/trendnine/" target="_blank"><SocialIcon icon={SocialIconType.INSTAGRAM} white /></LinkButton>
                            <LinkButton href="https://www.facebook.com/trendnine" target="_blank"><SocialIcon icon={SocialIconType.FACEBOOK} white /></LinkButton>
                            <LinkButton href="https://twitter.com/trendnine" target="_blank"><SocialIcon icon={SocialIconType.TWITTER} white /></LinkButton>
                            <LinkButton href="https://www.pinterest.com/trendnine/" target="_blank"><SocialIcon icon={SocialIconType.PINTEREST} white/></LinkButton>
                        </div>
                        <div className="menu-divider" />
                        <p>Get exclusive offers, inspiration, and trend updates delivered right to your inbox.</p>
                        <form onSubmit={this._subscribe} className="subscribe-form">
                            <Input
                                variant={InputVariant.OUTLINE}
                                placeholder="Email"
                                value={this.state.subscribeEmail}
                                onChange={this._onSubscribeEmailChange}
                                type={InputType.EMAIL} required={true} />
                            <Input type={InputType.SUBMIT} value="SUBSCRIBE"></Input>
                        </form>
                        {this.state.success && <p>Subscribed!</p>}
                        {/* {this.state.fail && <p className="error">Sorry, we had trouble subscribing to the email. Please check the email address or try again later.</p>} */}
                        <p className="disclaimer">© 2018 TrendNine, Inc. All rights reserved.</p>
                    </div>
                </div>
                <div className="menu-peek" onClick={this.props.toggleMenu}/>
            </div>
        );
    }

    private _menuRef: React.RefObject<HTMLDivElement>;

    private _subscribe = async (event) => {
        event.preventDefault();
        try {
            const response = await this.props.subscribe({ email: this.state.subscribeEmail });
            if (response.email) {
                this.setState({subscribeEmail: "", success: true});
                setTimeout(function() {
                    this.setState({success: false});
                }.bind(this), 5000);
            }
        } catch (err) {
            this.setState({ subscribeEmail: "", success: true });
            setTimeout(function() {
                this.setState({success: false});
            }.bind(this), 5000);
        }
        return false;
    }

    private _onSubscribeEmailChange = (subscribeEmail: string) => {
        this.setState({ subscribeEmail });
    }

    @autobind
    private _logout() {
        this.props.toggleMenu();
        this.props.history.push("/logout");
    }
}

export default withRouter(Menu);
