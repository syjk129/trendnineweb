import * as React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

export interface HeaderProps {
    loggedIn: boolean;
}

export default class Header extends React.Component<HeaderProps, never> {
    render() {
        return (
            <div className="main-header">
                <Link to="/discover">Discover</Link>
                <Link to="/shop">Shop</Link>
                {!this.props.loggedIn &&
                    <Link to="/login">Log In</Link>
                }
            </div>
        );
    }
}
