import * as H from "history";
import * as React from "react";
import { match, withRouter } from "react-router-dom";

import { Person } from "../../api/models";
import WithUserSession from "../../app/withUserSession";
import { LinkButton } from "../../components/button/index";
import Icon, { IconSize, IconVariant } from "../../components/icon";
import Input, { InputType, InputVariant } from "../../components/input";
import NavLink from "../../components/navLink";
import * as Logo from "./logo.png";

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
            <div className="main-header" id="mainHeader">
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
                                <LinkButton url="/login" pathname={pathname}>Log In</LinkButton>
                            }
                            {loggedIn && user &&
                                <div className="user-logged-in-buttons">
                                    <LinkButton url={`/user/${user.username}`}>
                                        <Icon variant={IconVariant.GIRL} size={IconSize.MEDIUM} />
                                    </LinkButton>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="nav-header">
                    <div className="nav-content">
                        <img className="nav-logo" src={Logo} onClick={() => history.push(isShop ? "/shop/home" : "/discover")} />
                        <div className="nav-header-links">
                            <div className="nav-pages">
                                <NavLink url={isShop ? "/shop/discover" : "/discover"} pathname={pathname} large>Trending</NavLink>
                                {loggedIn && user && <NavLink url={isShop ? "/shop/feed" : "/feed"} pathname={pathname} large>Feed</NavLink>}
                            </div>
                            <div className="search">
                                <Input variant={InputVariant.BLANK} placeholder="SEARCH" onEnterPress={ onSearch }/>
                                <Icon variant={IconVariant.SEARCH}></Icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
