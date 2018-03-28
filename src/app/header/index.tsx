import * as React from "react";
import { match, withRouter } from "react-router-dom";
import * as H from "history";

import NavLink from "../../components/navLink";
import Icon, { IconVariant } from "../../components/icon";
import Input, { InputType } from "../../components/input";
// import logo from "./logo.png";

import "./style.scss";

export interface HeaderProps {
    loggedIn: boolean;
    history: H.History;
    location: any;
}

export class Header extends React.Component<HeaderProps, never> {
    render() {
        const { loggedIn, history } = this.props;
        const onSearch = (value) => history.push({
            pathname: "/discover",
            search: `?q=${value}`,
        });

        const pathname = location.pathname;

        return (
            <div className="main-header">
                <div className="user-header">
                    <div className="header-left-buttons">
                        <NavLink url="/shop" pathname={pathname}>
                            Shop
                        </NavLink>
                        <NavLink url="/discover" pathname={pathname}>
                            Discover
                        </NavLink>
                    </div>
                    <div className="header-right-buttons">
                        {!loggedIn &&
                            <NavLink url="/login" pathname={pathname}>Log In</NavLink>
                        }
                    </div>
                </div>
                <div className="nav-header">
                    <div className="nav-logo" />
                    <div className="nav-header-links">
                        <div className="nav-pages">
                            <NavLink url="/discover" pathname={pathname} large>Trending</NavLink>
                            <NavLink url="/discover/feed" pathname={pathname} large>Feed</NavLink>
                            <NavLink url="/discover/new" pathname={pathname} large>New Arrivals</NavLink>
                            <NavLink url="/discover/brands" pathname={pathname} large>Brands</NavLink>
                        </div>
                        <div className="search">
                            <Icon variant={IconVariant.SEARCH}></Icon>
                            <Input placeholder="SEARCH" onEnterPress={ onSearch }/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);
