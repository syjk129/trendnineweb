import * as React from "react";
import { Link } from "react-router-dom";

import Button, { ButtonVariant, IconButton, LinkButton } from "../../components/button";
import Icon, { IconSize, IconVariant } from "../../components/icon";
import Input, { InputVariant } from "../../components/input";
import NavLink from "../../components/navLink";
import * as Logo from "../logo.png";

import "./style.scss";
import { HeaderProps } from "./types";

interface DesktopHeaderState {
    searchOpen: boolean;
}

export default class DesktopHeader extends React.Component<HeaderProps, DesktopHeaderState> {
    state: DesktopHeaderState = {
        searchOpen: false,
    };

    componentWillMount() {
        this._headerRef = React.createRef();
        this._logoRef = React.createRef();
        this._userButtonRef = React.createRef();
        this._pageSwitchRef = React.createRef();

        window.addEventListener("scroll", this._onScroll);
        window.addEventListener("touchmove", this._onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this._onScroll);
        window.removeEventListener("touchmove", this._onScroll);
    }

    render() {
        const { loggedIn, history } = this.props;
        const pathname = location.pathname;
        const isShop = pathname.indexOf("/shop") > -1;
        const user = JSON.parse(localStorage.getItem("user"));

        return (
            <div className="main-header" id="header">
                <div className="user-header" ref={this._headerRef}>
                    <div className="nav-content">
                        <div className="header-left-buttons">
                            <NavLink url="/discover" pathname={pathname} selected={!isShop}>
                                Discover
                            </NavLink>
                            <NavLink url="/shop" pathname={pathname} selected={isShop}>
                                Shop
                            </NavLink>
                        </div>
                        <Link className="nav-logo-container" to={isShop ? "/shop" : "/discover"}><img className="nav-logo" src={Logo} /></Link>
                        <div className="header-right-buttons">
                            {(!loggedIn || !user) &&
                                <LinkButton
                                    className="login-button"
                                    onClick={() => history.push(`${location.pathname}/login`)}
                                >
                                    Sign In / Join
                                </LinkButton>
                            }
                            {loggedIn && user &&
                                <div className="user-logged-in-buttons">
                                    <LinkButton to={`/user/${user.username}/wishlist`}>
                                        <Icon variant={IconVariant.WISHLIST} size={IconSize.LARGE} />
                                    </LinkButton>
                                    <LinkButton to={`/user/${user.username}`}>
                                        <Icon variant={IconVariant.PROFILE} size={IconSize.LARGE} />
                                    </LinkButton>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="nav-header">
                    <div className="nav-content">
                        <Link className="nav-logo-container left" to={isShop ? "/shop" : "/discover"}><img ref={this._logoRef} className="nav-logo hidden" src={Logo} /></Link>
                        <div className="nav-header-links">
                            <div className="nav-pages">
                                <NavLink url={isShop ? "/shop/discover" : "/discover"} pathname={pathname} >Trending</NavLink>
                                {loggedIn && user && !isShop && <NavLink url={isShop ? "/shop/feed" : "/feed"} pathname={pathname}>Feed</NavLink>}
                                <NavLink url={isShop ? "/shop/category/clothing" : "/discover/category/clothing"} pathname={pathname}>Clothing</NavLink>
                                <NavLink url={isShop ? "/shop/category/shoes" : "/discover/category/shoes"} pathname={pathname}>Shoes</NavLink>
                                <NavLink url={isShop ? "/shop/category/bags" : "/discover/category/bags"} pathname={pathname}>Bags</NavLink>
                                <NavLink url={isShop ? "/shop/category/accessories" : "/discover/category/accessories"} pathname={pathname}>accessories</NavLink>
                                <NavLink url={isShop ? "/shop/brands" : "/brands"} pathname={pathname}>Brands</NavLink>
                                <div className="page-switch hidden" ref={this._pageSwitchRef}>
                                    {isShop ? (
                                        <NavLink url="/discover" pathname={pathname}>Discover</NavLink>
                                    ) : (
                                        <NavLink url="/shop" pathname={pathname}>Shop</NavLink>
                                    )}
                                </div>
                            </div>
                            <div className="search">
                                <div className="search-item" onClick={this._toggleSearch}>
                                    <span className="search-label">SEARCH</span>
                                    <IconButton size={IconSize.LARGE} icon={IconVariant.SEARCH} />
                                </div>
                                {user && (
                                    <div className="user-buttons hidden" ref={this._userButtonRef}>
                                        <LinkButton to={`/user/${user.username}/wishlist`}>
                                            <Icon variant={IconVariant.WISHLIST} size={IconSize.LARGE} />
                                        </LinkButton>
                                        <LinkButton to={`/user/${user.username}`}>
                                            <Icon variant={IconVariant.PROFILE} size={IconSize.LARGE} />
                                        </LinkButton>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`search-header${this.state.searchOpen ? "" : " hidden"}`}>
                    <div className="nav-content">
                        <Input className="search-input" placeholder="SEARCH" onEnterPress={this._onSearch} autofocus />
                        <span className="close" onClick={this._toggleSearch}>&times;</span>
                    </div>
                </div>
            </div>
        );
    }

    private _headerRef: React.RefObject<HTMLDivElement>;
    private _logoRef: React.RefObject<HTMLImageElement>;
    private _userButtonRef: React.RefObject<HTMLDivElement>;
    private _pageSwitchRef: React.RefObject<HTMLDivElement>;
    private _lastScrollTop: number = 0;

    private _toggleSearch = () => {
        this.setState({ searchOpen: !this.state.searchOpen });
    }

    private _onSearch = (value) => {
        const isShop = this.props.location.pathname.indexOf("/shop") > -1;
        this._toggleSearch();
        this.props.history.push({
            pathname: isShop ? "/shop/discover" : "/discover",
            search: `?keyword=${value}`,
        });
    }

    private _onScroll = () => {
        const header = this._headerRef.current;
        const logo = this._logoRef.current;
        const userButtons = this._userButtonRef.current;
        const pageSwitch = this._pageSwitchRef.current;
        const rect = header.getBoundingClientRect();
        const scrollDelta = 200;

        if (header && logo) {
            const scrollTop = window.scrollY;
            if (Math.abs(this._lastScrollTop - scrollTop) <= scrollDelta) {
                return;
            }

            if (scrollTop > this._lastScrollTop && scrollTop > rect.height) {
                logo.classList.remove("hidden");
                if (userButtons) {
                    userButtons.classList.remove("hidden");
                }
                pageSwitch.classList.remove("hidden");
                header.classList.add("hidden");
            } else if (scrollTop + window.innerHeight < document.body.scrollHeight) {
                logo.classList.add("hidden");
                if (userButtons) {
                    userButtons.classList.add("hidden");
                }
                pageSwitch.classList.add("hidden");
                header.classList.remove("hidden");
            }

            this._lastScrollTop = scrollTop;
        }
    }
}
