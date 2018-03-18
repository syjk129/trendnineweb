import * as React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import NavLink from "../../components/navLink";
// import logo from "./logo.png";

import "./style.scss";

export interface HeaderProps {
    loggedIn: boolean;
}

export default class Header extends React.Component<HeaderProps, never> {
    render() {
        return (
            <div className="main-header">
                <div className="user-header">
                    <div className="header-left-buttons">
                        <NavLink url="/shop">Shop</NavLink>
                        <NavLink url="/discover">Discover</NavLink>
                    </div>
                    <div className="header-right-buttons">
                        {!this.props.loggedIn &&
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
                        Search
                    </div>
                </div>
            </div>
        );
    }
}
