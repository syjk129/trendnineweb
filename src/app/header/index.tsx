import * as React from "react";
import { withRouter } from "react-router-dom";
import * as H from "history";
import NavLink from "../../components/navLink";
import Icon, { IconVariant } from "../../components/icon";
import Input, { InputType } from "../../components/input";
// import logo from "./logo.png";

import "./style.scss";

export interface HeaderProps {
    loggedIn: boolean;
    history: H.History;
}

export class Header extends React.Component<HeaderProps, never> {
    render() {
        const { loggedIn, history } = this.props;
        const onSearch = (value) => history.push({
            pathname: "/discover",
            search: `?q=${value}`,
        });
        return (
            <div className="main-header">
                <div className="user-header">
                    <div className="header-left-buttons">
                        <NavLink url="/shop">Shop</NavLink>
                        <NavLink url="/discover">Discover</NavLink>
                    </div>
                    <div className="header-right-buttons">
                        {!loggedIn &&
                            <NavLink url="/login">Log In</NavLink>
                        }
                    </div>
                </div>
                <div className="nav-header">
                    <div className="nav-logo">
                        asdf
                    </div>
                    <div className="nav-pages">
                        <NavLink url="/discover">Trending</NavLink>
                        <NavLink url="/discover">Feed</NavLink>
                        <NavLink url="/discover">New Arrivals</NavLink>
                        <NavLink url="/discover">Brands</NavLink>
                    </div>
                    <div className="search">
                        <Icon variant={IconVariant.SEARCH}></Icon>
                        <Input placeholder="SEARCH" onEnterPress={ onSearch }/>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);
