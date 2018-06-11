import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";
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
import Shop from "../flows/shop";
import ShopDiscover from "../flows/shopDiscover";
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
    errors: Array<Error>;
}

export interface AppContext {
    api: any; // TODO
    setError(error: Error): void;
}

interface AppProviderProps {
    children: React.ReactNode;
    location: any;
    match: match<any>;
    setError(error: Error): void;
}

class AppProviderComponent extends React.Component<AppProviderProps, never> {
    constructor(props: AppProviderProps) {
        super(props);

        const api = new Api({
            // apiUrl: "http://54.175.34.30:8000",
            // apiUrl: "http://54.84.23.234:8000",
            apiUrl: "https://backend-alpha.trendnine.com",
            setError: props.setError,
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
            setError: this.props.setError,
        };
    }

    render() {
        return this.props.children;
    }

    private _api: any;
}

export const AppContextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
};

AppProviderComponent.childContextTypes = AppContextTypes;


const AppProvider = withRouter(AppProviderComponent);

export default class App extends React.Component<AppProps, AppState> {
    state: AppState = {
        loggedIn: false,
        errors: [],
    };

    componentWillMount() {
        const token = localStorage.getItem("tn_auth_token");

        if (token && token !== "undefined") {
            this.setState({ loggedIn: true });
        }
    }

    render() {
        return (
            <ErrorBoundary setLoggedState={this._setLoggedState} errors={this.state.errors}>
                <Router history={browserHistory}>
                    <AppProvider setError={this._setError}>
                        <Header loggedIn={this.state.loggedIn} />
                        <div className={`main-content ${isMobile && "mobile-view"}`} id="main-content">
                            <Route exact path="/" render={() => <Redirect to="/discover" />} />
                            <Route path="/login" render={(props) => <Auth {...props} setLoggedState={this._setLoggedState} />} />
                            <Route path="/register" render={(props) => <Auth {...props} setLoggedState={this._setLoggedState} />} />
                            <Route path="/discover/:pageName?" component={Discover} />
                            <Route path="/feed" component={Discover} />
                            <Route path="/user/:userId/:pageName?" component={User} />
                            <Route path="/shop/home" component={Shop} />
                            <Route path="/shop/discover" component={ShopDiscover} />
                            <Route path="/shop/feed" component={ShopDiscover} />
                            <Route path="/shop/product/:productId" component={ProductView} />
                            <Route path="/post/:postId" component={PostView} />
                            <Route path="/product/:productId" component={ProductView} />
                            <Route path="/trending" component={Trending} />
                            <Route path="*" component={null} />
                        </div>
                        {/* <Footer /> */}
                    </AppProvider>
                </Router>
            </ErrorBoundary>
        );
    }

    @autobind
    private _setLoggedState(loggedIn: boolean) {
        this.setState({ loggedIn });
    }

    @autobind
    private _setError(error: Error) {
        this.setState({
            errors: [...this.state.errors, error],
        });
    }
}
