import { polyfill } from "es6-promise";
import * as React from "react";
import { browserHistory, BrowserRouter, Route } from "react-router-dom";

import App from "./app";

polyfill();

export default function AppContainer() {
    return (
        <BrowserRouter history={browserHistory}>
            <Route component={App} />
        </BrowserRouter>
    );
}

export * from "./types";
