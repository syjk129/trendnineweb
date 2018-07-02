import * as React from "react";
import { Link } from "react-router-dom";

import { LinkButton } from "../../components/button";
import Icon, { IconSize, IconVariant } from "../../components/icon";
import Input, { InputVariant } from "../../components/input";
import NavLink from "../../components/navLink";
import * as Logo from "../logo.png";

import "./style.scss";
import { HeaderProps } from "./types";

export default class DesktopHeader extends React.Component<HeaderProps> {
    render() {
        const { loggedIn, history } = this.props;
        const pathname = location.pathname;
        const isShop = pathname.indexOf("/shop") > -1;
        const onSearch = (value) => history.push({
            pathname: isShop ? "/shop/discover" : "/discover",
            search: `?keyword=${value}`,
        });
        const user = JSON.parse(localStorage.getItem("user"));

        return (
            <div className="main-header" id="main-header">
                <div className="user-header">
                    <div className="nav-content">
                        <div className="header-left-buttons">
                            <NavLink url="/discover" pathname={pathname} selected={!isShop}>
                                Discover
                            </NavLink>
                            <NavLink url="/shop/home" pathname={pathname} selected={isShop}>
                                Shop
                            </NavLink>
                        </div>
                        <div className="header-right-buttons">
                            {(!loggedIn || !user) &&
                                <LinkButton to={`${this.props.location.pathname}/login`}>Log In</LinkButton>
                            }
                            {loggedIn && user &&
                                <div className="user-logged-in-buttons">
                                    <LinkButton to={`/user/${user.username}`}>
                                        <Icon variant={IconVariant.GIRL} size={IconSize.LARGE} />
                                    </LinkButton>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="nav-header">
                    <div className="nav-content">
                        <Link className="nav-logo-container" to={isShop ? "/shop/home" : "/discover"}><img className="nav-logo" src={Logo} /></Link>
                        <div className="nav-header-links">
                            <div className="nav-pages">
                                <NavLink url={isShop ? "/shop/discover" : "/discover"} pathname={pathname} large>Trending</NavLink>
                                {loggedIn && user && <NavLink url={isShop ? "/shop/feed" : "/feed"} pathname={pathname} large>Feed</NavLink>}
                                <NavLink url={isShop ? "/shop/brands" : "/brands"} pathname={pathname} large>Brands</NavLink>
                            </div>
                            <div className="search">
                                <Input variant={InputVariant.BLANK} placeholder="SEARCH" onEnterPress={ onSearch }/>
                                <Icon size={IconSize.LARGE} variant={IconVariant.SEARCH}></Icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
