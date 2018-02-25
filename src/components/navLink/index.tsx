import * as React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import "./style.scss";

interface NavLinkProps {
    url: string;
    name: string;
}

export default function NavLink({ url, name }: NavLinkProps) {
    return (
        <div className="nav-link">
            <Link to={url}>
                {name}
            </Link>
        </div>
    );
}
