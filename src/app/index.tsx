import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import {
    browserHistory,
    BrowserRouter as Router,
    Link,
    match,
    Redirect,
    Route,
    withRouter,
} from "react-router-dom";

import Api from "../api";
import Auth from "../flows/auth";
import Discover from "../flows/discover";
import PostView from "../flows/post";
import ProductView from "../flows/product";
import Trending from "../flows/trending";
import User from "../flows/user";

import ErrorBoundary from "./errorBoundary";
import Footer from "./footer";
import Header from "./header";

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
    location: any;
    match: match<any>;
}

class AppProviderComponent extends React.Component<AppProviderProps, never> {
    constructor(props: AppProviderProps) {
        super(props);

        const api = new Api({
            // apiUrl: "http://54.175.34.30:8000",
            // apiUrl: "http://54.84.23.234:8000",
            apiUrl: "http://52.91.113.226:8000",
        });

        this._api = api;
    }

    static childContextTypes: AppContext;

    componentWillReceiveProps() {
        this.forceUpdate();
    }

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

AppProviderComponent.childContextTypes = {
    api: PropTypes.any,
};

const AppProvider = withRouter(AppProviderComponent);

export default class App extends React.Component<AppProps, AppState> {
    state: AppState = {
        loggedIn: false,
    };

    componentWillMount() {
        const token = localStorage.getItem("tn_auth_token");

        if (token && token !== "undefined") {
            this.setState({ loggedIn: true });
        }
    }

    render() {
        return (
            <ErrorBoundary setLoggedState={this._setLoggedState}>
                <Router history={browserHistory}>
                    <AppProvider>
                        <Header loggedIn={this.state.loggedIn} />
                        <div className="main-content">
                            <Route exact path="/" render={() => <Redirect to="/discover" />} />
                            <Route path="/login" setLoggedState={this._setLoggedState} component={Auth} />
                            <Route path="/register" setLoggedState={this._setLoggedState} component={Auth} />
                            <Route path="/discover/:pageName?" component={Discover} />
                            <Route path="/feed" component={Discover} />
                            <Route path="/user/:userId/:pageName?" component={User} />
                            <Route path="/shop" component={null} />
                            <Route path="/post/:postId" component={PostView} />
                            <Route path="/product/:productId" component={ProductView} />
                            <Route path="/trending" component={Trending} />
                            <Route path="/shop" component={null} />
                            <Route path="*" component={null} />
                        </div>
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
