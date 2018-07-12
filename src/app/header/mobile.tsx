import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { Link } from "react-router-dom";

import { AppContext } from "../../app";
import Button, { ButtonVariant, IconButton } from "../../components/button";
import { IconSize, IconVariant } from "../../components/icon";
import NavLink from "../../components/navLink";
import * as Logo from "../logo.png";
import Menu from "./menu";
import { HeaderProps } from "./types";

import "./style.scss";

interface MobileHeaderState {
    showMenu: boolean;
}

export default class MobileHeader extends React.Component<HeaderProps, MobileHeaderState> {
    static contextTypes: AppContext;

    state: MobileHeaderState = {
        showMenu: false,
    };

    componentWillMount() {
        this._headerRef = React.createRef();

        document.addEventListener("scroll", this._onScroll);
        document.addEventListener("touchmove", this._onScroll);
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", this._onScroll);
        document.removeEventListener("touchmove", this._onScroll);
    }

    render() {
        const user = JSON.parse(localStorage.getItem("user"));
        const pathname = this.props.location.pathname;
        const isShop = pathname.indexOf("/shop") > -1;

       return (
            <div className="header">
                <Menu
                    open={this.state.showMenu}
                    loggedIn={!!user}
                    toggleMenu={this._toggleMenu}
                    isShop={isShop}
                    subscribe={this._subscribe}
                />
                <div className="mobile-header-container" ref={this._headerRef} id="header">
                    <div className="mobile-header">
                        <div className="mobile-left-header">
                            <NavLink url="/discover" pathname={pathname} selected={!isShop}>
                                Discover
                            </NavLink>
                            <NavLink url="/shop/home" pathname={pathname} selected={isShop}>
                                Shop
                            </NavLink>
                        </div>
                        <div className="mobile-right-header">
                            <Button
                                className="mobile-login-button"
                                variant={ButtonVariant.OUTLINE}
                                onClick={() => this.props.history.push(`${this.props.location.pathname}/login`)}
                            >
                                Sign In / Join
                            </Button>
                        </div>
                    </div>
                    <div className="mobile-app-header">
                        <IconButton icon={IconVariant.MENU} size={IconSize.LARGE} onClick={this._toggleMenu} selected={false} />
                        <Link className="nav-logo-container" to={isShop ? "/shop/discover" : "/discover"}>
                            <img
                                className="nav-logo"
                                src={Logo}
                            />
                        </Link>
                        <IconButton icon={IconVariant.PROFILE} size={IconSize.LARGE} url={user ? `/user/${user.id}` : "/login"}/>
                    </div>
                </div>
            </div>
        );
    }

    private _headerRef: React.RefObject<HTMLDivElement>;
    private _lastScrollTop: number = 0;

    private _onScroll = () => {
        const header = this._headerRef.current;
        const rect = header.getBoundingClientRect();
        const scrollDelta = 5;

        if (header) {
            const scrollTop = document.documentElement.scrollTop;
            if (Math.abs(this._lastScrollTop - scrollTop) <= scrollDelta) {
                return;
            }

            if (scrollTop > this._lastScrollTop && scrollTop > rect.height) {
                header.classList.add("nav-hidden");
            } else if (scrollTop + window.innerHeight < document.body.scrollHeight) {
                header.classList.remove("nav-hidden");
            }

            this._lastScrollTop = scrollTop;
        }

    }

    private _subscribe = (email: any) => {
        return this.context.api.subscribe(email);
    }

    @autobind
    private _toggleMenu() {
        if (!this.state.showMenu) {
            document.body.classList.add("noscroll");
        } else {
            document.body.classList.remove("noscroll");
        }

        this.setState({ showMenu: !this.state.showMenu });
    }
}

MobileHeader.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
