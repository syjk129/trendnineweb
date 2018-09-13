import { PropTypes } from "prop-types";
import * as React from "react";
import { Link } from "react-router-dom";

import { AppContext } from "../../app";
import Button, { ButtonVariant, IconButton } from "../../components/button";
import { IconSize, IconVariant } from "../../components/icon";
import NavLink from "../../components/navLink";
import { noScroll, removeNoScroll } from "../../util/scroll";
import * as Logo from "../logo.png";
import Menu from "./menu";
import Search from "./search";
import { HeaderProps } from "./types";

import "./style.scss";

interface MobileHeaderState {
    showMenu: boolean;
    searchString: string;
    showSearch: boolean;
}

export default class MobileHeader extends React.Component<HeaderProps, MobileHeaderState> {
    static contextTypes: AppContext;

    state: MobileHeaderState = {
        showMenu: false,
        searchString: "",
        showSearch: false,
    };

    componentWillMount() {
        this._headerRef = React.createRef();

        window.addEventListener("scroll", this._onScroll);
        window.addEventListener("touchmove", this._onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this._onScroll);
        window.removeEventListener("touchmove", this._onScroll);
    }

    componentWillReceiveProps(nextProps: HeaderProps) {
        if (this.props.location.pathname !== nextProps.location.pathname && (!nextProps.location.state || !nextProps.location.state.modal)) {
            this._lastScrollTop = 0;
            this._close();
        }
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
                            <NavLink url="/" pathname={pathname} selected={!isShop}>
                                Discover
                            </NavLink>
                            <NavLink url="/shop" pathname={pathname} selected={isShop}>
                                Shop
                            </NavLink>
                        </div>
                        <div className="mobile-right-header">
                            {user ? (
                                <>
                                    <IconButton icon={IconVariant.WISHLIST} size={IconSize.MEDIUM} url={`/user/${user.id}/wishlist`}/>
                                    <IconButton icon={IconVariant.PROFILE} size={IconSize.MEDIUM} url={`/user/${user.id}`}/>
                                </>
                            ) : (
                                <Button
                                    className="mobile-login-button"
                                    variant={ButtonVariant.OUTLINE}
                                    onClick={() => this.props.history.push({
                                        pathname: "/login",
                                        state: { modal: true },
                                    })}
                                >
                                    Sign In / Join
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="mobile-app-header">
                        <IconButton icon={IconVariant.MENU} size={IconSize.MEDIUM} onClick={this._toggleMenu} selected={false} />
                        <Link className="nav-logo-container" to={isShop ? "/shop" : "/"} onClick={this._close}>
                            <img
                                className="nav-logo"
                                src={Logo}
                            />
                        </Link>
                        {this.state.showSearch ? (
                            <span className="close" onClick={this._toggleSearch}>&times;</span>
                        ) : (
                            <IconButton icon={IconVariant.SEARCH} size={IconSize.MEDIUM} onClick={this._toggleSearch} />
                        )}
                    </div>
                    {this.state.showSearch && (
                        <Search
                            searchString={this.state.searchString}
                            onSearchStringChange={this._onSearchStringChange}
                            search={this._onSearch}
                        />
                    )}
                </div>
            </div>
        );
    }

    private _headerRef: React.RefObject<HTMLDivElement>;
    private _lastScrollTop: number = 0;

    private _onScroll = () => {
        const header = this._headerRef.current;
        const scrollDelta = 5;

        if (header) {
            const rect = header.getBoundingClientRect();
            const scrollTop = window.scrollY;
            if (Math.abs(this._lastScrollTop - scrollTop) <= scrollDelta) {
                return;
            }

            if (Math.abs(scrollTop - this._lastScrollTop) < 300 && scrollTop > this._lastScrollTop && scrollTop > rect.height) {
                header.classList.add("nav-hidden");
            } else if (scrollTop + window.innerHeight < document.body.scrollHeight) {
                header.classList.remove("nav-hidden");
                header.classList.remove("no-animation");
            }

            this._lastScrollTop = scrollTop;
        }
    }

    private _close = () => {
        this.setState({ showMenu: false, showSearch: false });
        removeNoScroll();
    }

    private _subscribe = (email: any) => {
        return this.context.api.subscribe(email);
    }

    private _onSearchStringChange = (searchString: string) => {
        this.setState({ searchString });
    }

    private _onSearch = () => {
        const isShop = this.props.location.pathname.indexOf("/shop") > -1;
        this.props.history.push(`${isShop ? "/shop" : ""}/discover?keyword=${this.state.searchString}`);
        this._toggleSearch();
    }

    private _toggleSearch = () => {
        const contentToolbar = document.getElementById("mobile-content-toolbar");
        const pageNavigation = document.getElementById("page-navigation");

        if (!this.state.showSearch) {
            noScroll();
            if (contentToolbar) {
                contentToolbar.style.visibility = "hidden";
            }
            if (pageNavigation) {
                pageNavigation.style.visibility = "hidden";
            }
        } else {
            removeNoScroll();
            if (contentToolbar) {
                contentToolbar.style.visibility = "visible";
            }
            if (pageNavigation) {
                pageNavigation.style.visibility = "visible";
            }
        }

        this.setState({ showSearch: !this.state.showSearch });
    }

    private _toggleMenu = () => {
        if (!this.state.showMenu) {
            noScroll();
        } else {
            removeNoScroll();
        }

        this.setState({ showMenu: !this.state.showMenu });
    }
}

MobileHeader.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
