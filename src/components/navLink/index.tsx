import * as React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import "./style.scss";

interface NavLinkProps {
    url: string | any;
    pathname: string;
    className?: string;
    small?: boolean;
    muted?: boolean;
    selected?: boolean;
    children?: React.ReactNode;
    onClick?(): void;
}

export default function NavLink({ url, className, small, muted, selected, children, onClick }: NavLinkProps) {
    let classes = "nav-link";

    if (className) {
        classes += ` ${className}`;
    }

    if (selected) {
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
            <Link className="nav-link-a" to={url} onClick={onClick}>
                {children}
            </Link>
        </div>
    );
}
