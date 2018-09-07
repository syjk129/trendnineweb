import * as React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import "./style.scss";

interface NavLinkProps {
    url: string | any;
    pathname: string;
    small?: boolean;
    muted?: boolean;
    selected?: boolean;
    children?: React.ReactNode;
    onClick?(): void;
}

export default function NavLink({ url, pathname, small, muted, selected, children, onClick }: NavLinkProps) {
    let classes = "nav-link";

    if (pathname === url || selected) {
        classes += " selected";
    }

    if (small) {
        classes += " small";
    }

    if (muted) {
        classes += " muted";
    }

    return (
        <div className={classes}>
            <Link to={url} onClick={onClick}>
                {children}
            </Link>
        </div>
    );
}
