import * as React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import { AppContext, AppContextTypes } from "../app";

export interface FooterProps {
}

export default class Footer extends React.Component<FooterProps, never> {
    static contextTypes: AppContext;

    render() {
        return (
            <div>
                Footer
            </div>
        );
    }
}

Footer.contextTypes = AppContextTypes;
