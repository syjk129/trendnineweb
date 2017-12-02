import * as React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import Temp from "../components/temp";

export interface FooterProps {
}

export default class Footer extends React.Component<FooterProps, never> {
    render() {
        return (
            <div>
                Footer
            </div>
        );
    }
}
