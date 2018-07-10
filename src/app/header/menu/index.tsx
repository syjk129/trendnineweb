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
    searchString: string;
    subscribeEmail: string;
    success: boolean;
    fail: boolean;
}

class Menu extends React.Component<MenuProps, MenuState> {
    state: MenuState = {
        searchString: "",
        subscribeEmail: "",
        success: false,
        fail: false,
    };

    render() {
        const { isShop, loggedIn, location } = this.props;

        return (
            <div className={`menu ${this.props.open && "open"}`}>
                <div className="menu-header">
                    <span className="close" onClick={this.props.toggleMenu}>&times;</span>
                    <Link to={isShop ? "/shop/discover" : "/discover"}>
                        <img
                            className="nav-logo"
                            src={LogoWhite}
                            onClick={this.props.toggleMenu}
                        />
                    </Link>
                    <span />
                </div>
                <div className="menu-content">
                    <div className="mobile-search">
                        <Input
                            value={this.state.searchString}
                            placeholder="Search"
                            theme={InputTheme.LIGHT}
                            variant={InputVariant.BLANK}
                            onChange={this._onInputChange}
                            onEnterPress={this._onSearch}
                        />
                        <Icon variant={IconVariant.SEARCH} />
                    </div>
                    <LinkButton
                        className="menu-link"
                        selected={location.pathname === "/discover" || location.pathname === "/shop/discover"}
                        to={isShop ? "/shop/discover" : "/discover"}
                        onClick={this.props.toggleMenu}
                    >
                        Trending
                    </LinkButton>
                    <LinkButton
                        className="menu-link"
                        to={isShop ? "/shop/feed" : "/feed"}
                        onClick={this.props.toggleMenu}
                    >
                        Feed
                    </LinkButton>
                    <LinkButton
                        className="menu-link"
                        to={isShop ? "/shop/brands" : "/brands"}
                        onClick={this.props.toggleMenu}
                    >
                       Brands
                    </LinkButton>
                    <div className="menu-divider" />
                    <LinkButton
                        className="menu-link"
                        to="/shop/discover"
                        onClick={this.props.toggleMenu}
                        selected={isShop}
                    >
                        Shop
                    </LinkButton>
                    <LinkButton
                        className="menu-link"
                        to="/discover"
                        onClick={this.props.toggleMenu}
                        selected={!isShop}
                    >
                        Discover
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
                        to={isShop ? "/shop/about" : "/about"}
                        onClick={this.props.toggleMenu}
                    >
                        About Us
                    </LinkButton>
                    <LinkButton
                        className="menu-link"
                        to={isShop ? "/shop/opportunities" : "/opportunities"}
                        onClick={this.props.toggleMenu}
                    >
                        I'm an Influencer
                    </LinkButton>
                    <LinkButton
                        className="menu-link"
                        to={isShop ? "/shop/terms" : "/terms"}
                        onClick={this.props.toggleMenu}
                    >
                        Terms &amp; Conditions
                    </LinkButton>
                    <LinkButton
                        className="menu-link"
                        to={isShop ? "/shop/privacy" : "/privacy"}
                        onClick={this.props.toggleMenu}
                    >
                        Privacy Policy
                    </LinkButton>
                    <LinkButton
                        className="menu-link"
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
        );
    }

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
    private _onInputChange(searchString: string) {
        this.setState({ searchString });
    }

    @autobind
    private _logout() {
        this.props.toggleMenu();
        this.props.history.push("/logout");
    }

   @autobind
   private _onSearch() {
       this.props.toggleMenu();
       this.props.history.push(`${this.props.location.pathname}?keyword=${this.state.searchString}`);
   }
}

export default withRouter(Menu);
