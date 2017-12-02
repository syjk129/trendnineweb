import * as React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import Temp from "../components/temp";

export interface HeaderProps {
}

export default class Header extends React.Component<HeaderProps, never> {
    render() {
        return (
            <div>
                <Link to="/discover">Discover</Link>
                <Link to="/shop">Shop</Link>
            </div>
        );
    }
}
