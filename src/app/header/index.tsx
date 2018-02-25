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
                        <NavLink url="/shop" name="Shop" />
                        <NavLink url="/discover" name="Discover" />
                    </div>
                    <div className="header-right-buttons">
                        {!this.props.loggedIn &&
                            <NavLink url="/login" name="Log In" />
                        }
                    </div>
                </div>
                <div className="nav-header">
                    <div className="nav-logo">
                        asdf
                    </div>
                    <div className="nav-pages">
                        <NavLink url="/discover" name="Trending" />
                        <NavLink url="/discover" name="Feed" />
                        <NavLink url="/discover" name="New Arrivals" />
                        <NavLink url="/discover" name="Brands" />
                    </div>
                    <div className="search">
                        Search
                    </div>
                </div>
            </div>
        );
    }
}
