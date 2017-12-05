import * as React from "react";
import { PropTypes } from "prop-types";
import { BrowserRouter as Router, Link, Redirect, Route, browserHistory } from "react-router-dom";

import Temp from "../components/temp";
import Auth from "../flows/auth";
import Discover from "../flows/discover";
import Api from "../api";

import Header from "./header";
import Footer from "./footer";
import ErrorBoundary from "./errorBoundary";

export interface AppProps {
}

export interface AppContext {
    api: any; // TODO
}

interface AppProviderProps {
    children: React.ReactNode;
}

class AppProvider extends React.Component<AppProviderProps, never> {
    constructor(props: AppProviderProps) {
        super(props);

        const api = new Api({
            apiUrl: "http://54.175.34.30:8000", // TODO: get apiUrl from webpack env
            token: "", // TODO: get token from session
        });

        this._api = api;
    }

    static childContextTypes: AppContext;

    getChildContext(): AppContext {
        return {
            api: this._api,
        };
    }

    render() {
        return this.props.children;
    }

    private _api: any;
}

AppProvider.childContextTypes = {
    api: PropTypes.any,
};

export default class App extends React.Component<AppProps, never> {
    render() {
        return (
            <ErrorBoundary>
                <Router history={browserHistory}>
                    <AppProvider>
                        <Header />
                        <Route exact path="/" render={() => <Redirect to="/discover" />} />
                        <Route path="/login" component={Auth} />
                        <Route path="/discover" component={Discover} />
                        <Route path="/shop" component={null} />
                        <Route path="/profile/:userId" component={null} />
                        <Route path="/shop" component={null} />
                        <Footer />
                    </AppProvider>
                </Router>
            </ErrorBoundary>
        );
    }
}
