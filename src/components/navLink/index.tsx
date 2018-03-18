import * as React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import "./style.scss";

interface NavLinkProps {
    url: string;
    children?: React.ReactNode;
    onClick?(): void;
}

export default function NavLink({ url, children, onClick }: NavLinkProps) {
    return (
        <div className="nav-link">
            <Link to={url} onClick={onClick}>
                {children}
            </Link>
        </div>
    );
}
