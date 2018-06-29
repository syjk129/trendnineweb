import * as React from "react";
import { browserHistory, BrowserRouter, Route } from "react-router-dom";

import App from "./app";

export default function AppContainer() {
    return (
        <BrowserRouter onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
            <Route component={App} />
        </BrowserRouter>
    );
}

export * from "./types";
