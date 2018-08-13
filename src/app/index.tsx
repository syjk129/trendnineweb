import { polyfill } from "es6-promise";
import { createBrowserHistory as createHistory } from "history";
import Promise from "promise-polyfill";
import * as React from "react";
import { browserHistory, Route, Router } from "react-router-dom";
import "url-search-params-polyfill";

import Cookies from "../util/cookies";
import { generateUUID } from "../util/uuid";

// To add to window
if (!(window as any).Promise) {
  (window as any).Promise = Promise;
}

import App from "./app";

polyfill();

export default class AppContainer extends React.Component {
    componentWillMount() {
        this._history = createHistory(this.props);
        if (this._history && this._history.location && this._history.location.state && this._history.location.state.modal) {
            const state = { ...this._history.location.state };
            delete state.modal;
            this._history.replace({ ...this._history.location, state });
        }

        if (!Cookies.cookieExists("sessionid") || !Cookies.getCookie("sessionid")) {
            Cookies.setCookie("sessionid", generateUUID());
        }
    }

    render() {
        return (
            <Router history={this._history}>
                <Route component={App} />
            </Router>
        );
    }

    private _history: any;
}

export * from "./types";
