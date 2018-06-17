import * as React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import "./style.scss";

interface NavLinkProps {
    url: string;
    pathname: string;
    large?: boolean;
    selected?: boolean;
    children?: React.ReactNode;
    onClick?(): void;
}

export default function NavLink({ url, pathname, large, selected, children, onClick }: NavLinkProps) {
    let classes = "nav-link";

    if (pathname === url || selected) {
        classes += " selected";
    }

    if (large) {
        classes += " large";
    }

    return (
        <div className={classes}>
            <Link to={url} onClick={onClick}>
                {children}
            </Link>
        </div>
    );
}
