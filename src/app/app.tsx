import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";
import {
    Link,
    match,
    Redirect,
    Route,
} from "react-router-dom";

import Api from "../api";
import Modal from "../components/modal";
import Auth from "../flows/auth";
import BrandView from "../flows/brands";
import Discover from "../flows/discover";
import PostView from "../flows/post";
import ProductView from "../flows/product";
import RouteProps from "../flows/routeProps";
import Shop from "../flows/shop";
import ShopDiscover from "../flows/shopDiscover";
import Trending from "../flows/trending";
import User from "../flows/user";
import ErrorBoundary from "./errorBoundary";
import Footer from "./footer";
import Header from "./header";
import { AppContext, AppContextTypes } from "./types";

import "../styles/base.scss";

export interface AppProps {
}

interface AppState {
    loggedIn: boolean;
    errors: Array<Error>;
    modalContent: React.ReactNode;
}

interface AppProviderProps extends RouteProps {
    children: React.ReactNode;
    setError(error: Error): void;
    openModal(component: React.ReactNode): void;
}

class AppProvider extends React.Component<AppProviderProps, never> {
    constructor(props: AppProviderProps) {
        super(props);

        const api = new Api({
            apiUrl: "https://backend-alpha.trendnine.com",
            setError: props.setError,
        });

        this._api = api;
    }

    static childContextTypes: AppContext;

    getChildContext(): AppContext {
        return {
            api: this._api,
            setError: this.props.setError,
            openModal: this.props.openModal,
        };
    }

    render() {
        return this.props.children;
    }

    private _api: any;
}

AppProvider.childContextTypes = AppContextTypes;

type Props = RouteProps;

export default class App extends React.Component<Props, AppState> {
    state: AppState = {
        loggedIn: false,
        errors: [],
        modalContent: null,
    };

    componentWillMount() {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("tn_auth_token");

        if (user !== null && user !== "undefined" && token && token !== "undefined") {
            const exp = JSON.parse(atob(token.split(".")[1]))["exp"];
            const current = (new Date()).getTime() / 1000;

            if (exp > current) {
                this.setState({ loggedIn: true });
            } else {
                this.setState({ loggedIn: false });
            }
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.location !== this.props.location) {
            this._previousLocation = this.props.location;
        }
    }

    render() {
        return (
            <ErrorBoundary setLoggedState={this._setLoggedState} removeError={this._removeError} errors={this.state.errors}>
                <AppProvider {...this.props} setError={this._setError} openModal={this._openModal}>
                    <Header loggedIn={this.state.loggedIn} />
                    <div className={`main-content ${isMobile && "mobile-view"}`} id="main-content">
                        <Route exact path="/" render={() => <Redirect to="/discover" />} />
                        <Route path="/discover/:pageName?" component={Discover} />
                        <Route path="/feed" component={Discover} />
                        <Route path="/brands" component={BrandView} />
                        <Route path="/user/:userId/:pageName?" component={User} />
                        <Route path="/shop/home" component={Shop} />
                        <Route path="/shop/discover" component={ShopDiscover} />
                        <Route path="/shop/feed" component={ShopDiscover} />
                        <Route path="/shop/brands" component={BrandView} />
                        <Route path="/shop/product/:productId" component={ProductView} />
                        <Route path="/post/:postId" component={PostView} />
                        <Route path="/product/:productId" component={ProductView} />
                        <Route path="/trending" component={Trending} />
                        <Route path="/:url*/login" render={(props) => <Auth {...props} close={this._redirectCloseModal} setLoggedState={this._setLoggedState} />}/>
                        <Route path="/logout" render={(props) => <Auth {...props} close={this._redirectCloseModal} setLoggedState={this._setLoggedState} />} />
                        <Route path="/register" render={(props) => <Auth {...props} close={this._redirectCloseModal} setLoggedState={this._setLoggedState} />} />
                        <Route path="*" component={null} />
                    </div>
                    <Modal isOpen={this.state.modalContent !== null} close={this._closeModal}>
                        {this.state.modalContent}
                    </Modal>
                </AppProvider>
            </ErrorBoundary>
        );
    }

    private _previousLocation: any;

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

    @autobind
    private _removeError(error: Error) {
        const errors = this.state.errors.filter(err => err == error);
        this.setState({
            errors,
        });
    }

    @autobind
    private _openModal(component: React.ReactNode) {
        this.setState({ modalContent: component });
    }

    private _redirectCloseModal = () => {
        this.props.history.push(this._previousLocation && this._previousLocation.pathname || "/");
    }

    private _closeModal = () => {
        this.setState({ modalContent: null });
    }
}