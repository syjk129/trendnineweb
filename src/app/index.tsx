import * as React from "react";
import { PropTypes } from "prop-types";
import { BrowserRouter as Router, Link, Redirect, Route, browserHistory } from "react-router-dom";
import autobind from "autobind-decorator";

import Auth from "../flows/auth";
import Discover from "../flows/discover";
import PostView from "../flows/post";
import Api from "../api";

import Header from "./header";
import Footer from "./footer";
import ErrorBoundary from "./errorBoundary";

import "../styles/base.scss";

export interface AppProps {
}

interface AppState {
    loggedIn: boolean;
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
            // apiUrl: "http://54.175.34.30:8000",
            apiUrl: "http://54.84.23.234:8000",
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

export default class App extends React.Component<AppProps, AppState> {
    state: AppState = {
        loggedIn: false,
    };

    render() {
        return (
            <ErrorBoundary setLoggedState={this._setLoggedState}>
                <Router history={browserHistory}>
                    <AppProvider>
                        <Header loggedIn={this.state.loggedIn} />
                        <Route exact path="/" render={() => <Redirect to="/discover" />} />
                        <Route path="/login" setLoggedState={this._setLoggedState} component={Auth} />
                        <Route path="/register" component={Auth} />
                        <Route path="/discover" component={Discover} />
                        <Route path="/shop" component={null} />
                        <Route path="/post/:postId" component={PostView} />
                        <Route path="/shop" component={null} />
                        <Route path="*" component={null} />
                        <Footer />
                    </AppProvider>
                </Router>
            </ErrorBoundary>
        );
    }

    @autobind
    private _setLoggedState(loggedIn: boolean) {
        this.setState({ loggedIn });
    }
}
