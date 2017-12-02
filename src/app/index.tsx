import * as React from "react";
import { BrowserRouter as Router, Link, Redirect, Route, browserHistory } from "react-router-dom";

import Temp from "../components/temp";
import Discover from "../flows/discover";

import Header from "./header";
import Footer from "./footer";

export interface AppProps {
}

export default class App extends React.Component<AppProps, never> {
    render() {
        return (
            <div>
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
            </div>
        );
    }
}
