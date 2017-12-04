import * as React from "react";
import { PropTypes } from "prop-types";
import { BrowserRouter as Router, Link, Redirect, Route, browserHistory } from "react-router-dom";

import Temp from "../components/temp";
import Discover from "../flows/discover";
import Api from "../api";

import Header from "./header";
import Footer from "./footer";

export interface AppProps {
}

export interface AppContext {
    api: any; // TODO
}

interface AppProviderProps {
    children: React.ReactChild;
}

class AppProvider extends React.Component<AppProviderProps, never> {
    constructor(props: AppProviderProps) {
        super(props);

        const api = new Api({
            apiUrl: "http://54.175.34.30:8000",
            token: "",
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
            <AppProvider>
                <Router history={browserHistory}>
                    <div>
                        <Header />
                        <Route exact path="/" component={Temp} />
                        <Route path="/discover" component={Discover} />
                        <Route path="/shop" component={null} />
                        <Route path="/profile/:userId" component={null} />
                        <Route path="/shop" component={null} />
                        <Footer />
                    </div>
                </Router>
            </AppProvider>
        );
    }
}
