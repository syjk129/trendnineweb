import autobind from "autobind-decorator";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { Helmet } from "react-helmet";
import {
    Redirect,
    Route,
    Switch,
} from "react-router-dom";

import Api from "../api";
import Spinner, { SpinnerContainer } from "../components/spinner";
import AboutUs from "../flows/about";
import Article from "../flows/article";
import ArticlesView from "../flows/articles";
import Auth from "../flows/auth";
import BrandView from "../flows/brands";
import CMSView from "../flows/cms";
import PostUpload from "../flows/cms/postUpload";
import CollectionsView from "../flows/collections";
import ContactUs from "../flows/contact";
import Discover from "../flows/discover";
import HomeView from "../flows/home";
import TermsAndConditions from "../flows/legal";
import LooksView from "../flows/looks";
import OnboardingView from "../flows/onboarding";
import Opportunities from "../flows/opportunities";
import PostView from "../flows/post";
import PrivacyPolicy from "../flows/privacy";
import ProductView from "../flows/product";
import RouteProps from "../flows/routeProps";
import ShareView from "../flows/share";
import ShopView from "../flows/shop";
import ShopDiscover from "../flows/shopDiscover";
import Trending from "../flows/trending";
import User from "../flows/user";
import ErrorBoundary from "./errorBoundary";
import Footer from "./footer";
import Header from "./header";
import PrivateRoute from "./privateRoute";
import { AppContext, AppContextTypes } from "./types";

import "../styles/base.scss";
declare var API_URL: string;
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
    setLoggedState(loggedIn: boolean): void;
}

interface AppProviderState {
    isLoading: boolean;
}

class AppProvider extends React.Component<AppProviderProps, AppProviderState> {
    state: AppProviderState = {
        isLoading: false,
    };

    constructor(props: AppProviderProps) {
        super(props);

        const api = new Api({
            apiUrl: API_URL || "https://api.trendnine.com",
            setError: props.setError,
        });

        this._api = api;
    }

    static childContextTypes: AppContext;

    async componentWillMount() {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("tn_auth_token");

        if (user !== null && user !== "undefined" && token && token !== "undefined") {
            const exp = JSON.parse(atob(token.split(".")[1]))["exp"];
            const current = (new Date()).getTime() / 1000;
            this.setState({ isLoading: true });

            if (exp > current) {
                this.setState({ isLoading: false });
                this.props.setLoggedState(true);
            } else {
                const response = await this._api.refreshToken();
                this.setState({ isLoading: false });
                if (response && response.access) {
                    this.props.setLoggedState(true);
                } else {
                    this.props.setLoggedState(false);
                }
            }
        }
    }

    getChildContext(): AppContext {
        return {
            api: this._api,
            setError: this.props.setError,
            openModal: this.props.openModal,
        };
    }

    render() {
        if (this.state.isLoading) {
            return (
                <SpinnerContainer>
                    <Spinner />
                </SpinnerContainer>
            );
        }

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

    constructor(props: Props) {
        super(props);

        this._mainContentRef = React.createRef();
        this._previousLocation = this.props.location;
    }

    componentDidMount() {
        const header = document.getElementById("main-header");
        const footer = document.getElementById("footer");
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const footerHeight = footer ? footer.getBoundingClientRect().height : 0;
        if (this._mainContentRef.current) {
            this._mainContentRef.current.style.minHeight = `${window.innerHeight - headerHeight - footerHeight}px`;
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            if (!nextProps.location.state || !nextProps.location.state.modal && !nextProps.location.state.noScroll) {
                // Don't scroll to top if it's a pop action (meaning user pressed back button)
                if (nextProps.history.action !== "POP") {
                    if (!nextProps.location.state || !nextProps.location.state.modalClose) {
                        window.scrollTo(0, 0);
                    }
                } else {
                    window.scrollTo(0, this._previousScroll);
                }
                this._previousScroll = window.scrollY;

                // Reset Mobile header to show full nav without animation
                if (isMobile) {
                    const mobileHeader = document.getElementById("header");
                    if (mobileHeader) {
                        mobileHeader.classList.remove("nav-hidden");
                        mobileHeader.classList.add("no-animation");
                    }
                }
            }
        } else if (nextProps.history.action === "PUSH" && !nextProps.location.state) {
            window.scrollTo(0, 0);
        }
    }

    componentWillUpdate(nextProps: Props) {
        const { location } = this.props;
        // set previousLocation if props.location is not modal
        if (
            nextProps.history.action !== "POP" &&
            (!location.state || !location.state.modal)
        ) {
            this._previousLocation = this.props.location;
        }
    }

    render() {
        const isModal = this.props.location.state && this.props.location.state.modal;

        return (
            <ErrorBoundary setLoggedState={this._setLoggedState} removeError={this._removeError} errors={this.state.errors}>
                <AppProvider {...this.props} setError={this._setError} openModal={this._openModal} setLoggedState={this._setLoggedState}>
                    <Helmet defer={false}>
                        <meta property="og:title" content="TrendNine | Discover & Shop the Looks from Fashion Influencers"/>
                        <meta property="og:description" content="Get daily outfit inspiration from Sincerely Jules, Song of Style, We Wore What, and thousands of influencers, wearing brands you love, such as ASOS, Zimmerman, and Balenciaga. Shopping for trending clothes, shoes, handbags, accessories, and swimsuits from top bloggers, influencers, and brands has never been easier. Shop in style."/>
                        <meta property="og:url" content="https://www.trendnine.com"/>
                        <meta property="og:image" content="https://trendnine-dev-bucket.s3.amazonaws.com/images/2018/07/599f91b9949f48109bd829f6dc2d3aab.png"/>
                        <meta property="og:type" content="blog" />
                    </Helmet>
                    <Header loggedIn={this.state.loggedIn} />
                    <div className={`main-content ${isMobile && "mobile-view"}`} id="main-content" ref={this._mainContentRef}>
                        <Switch location={isModal ? this._previousLocation : this.props.location}>
                            <Route exact path="/" component={HomeView} />
                            <Route path="/looks:query?" component={LooksView} />
                            <Route path="/product/:productId" component={ProductView} />
                            <Route path="/feed" component={Discover} />
                            <Route path="/brands" component={BrandView} />
                            <Route path="/editorials" component={ArticlesView} />
                            <Route path="/collections" component={CollectionsView} />
                            <Route path="/user/:userId/:pageName?" component={User} />
                            <Route path="/shop" exact component={ShopView} />
                            <Route path="/shop/brands" component={BrandView} />
                            <Route path="/shop/product/:productId" component={ProductView} />
                            <Route path="/shop/category/:categoryName" component={ShopDiscover} />
                            <Route path="/shop/:category?/:subcategory?" component={ShopView} />
                            <Route path="/post/:postId" component={PostView} />
                            <Route path="/article/:articleId" component={Article} />
                            <Route path="/trending" component={Trending} />
                            <Route path="/:url*/share/:shareType?/:shareId?" render={(props) => <ShareView {...props} close={this._redirectCloseModal} />} />
                            <Route path="/:url*/about" component={AboutUs} />
                            <Route path="/:url*/contact" component={ContactUs} />
                            <Route path="/:url*/terms" component={TermsAndConditions} />
                            <Route path="/:url*/opportunities" component={Opportunities} />
                            <Route path="/:url*/privacy" component={PrivacyPolicy} />
                            <Route path="/login" render={(props) => <Auth {...props} close={this._redirectCloseModal} setLoggedState={this._setLoggedState} />}/>
                            <Route path="/onboarding" render={(props) => <OnboardingView {...props} close={this._redirectCloseModal} />}/>
                            <Route path="/logout" render={(props) => <Auth {...props} close={this._redirectCloseModal} setLoggedState={this._setLoggedState} />} />
                            <Route path="/register" render={(props) => <Auth {...props} close={this._redirectCloseModal} setLoggedState={this._setLoggedState} />} />
                            <PrivateRoute path="/cms" component={CMSView} />
                            <PrivateRoute path="/upload/:postType/:postId?" component={PostUpload} />
                        </Switch>
                        {isModal && (
                            <>
                                <Route path="/login" render={(props) => <Auth {...props} close={this._redirectCloseModal} setLoggedState={this._setLoggedState} />}/>
                                <Route path="/post/:postId" render={(props) => <PostView {...props} close={this._redirectCloseModal} />} />
                                <Route path="/product/:productId" render={(props) => <ProductView {...props} close={this._redirectCloseModal} />} />
                            </>
                        )}
                    </div>
                    <Footer {...this.props} />
                </AppProvider>
            </ErrorBoundary>
        );
    }

    private _mainContentRef: React.RefObject<HTMLDivElement>;
    private _previousLocation: any;
    private _previousScroll: any;

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
        const errors = this.state.errors.filter(err => err === error);
        this.setState({
            errors,
        });
    }

    @autobind
    private _openModal(component: React.ReactNode) {
        this.setState({ modalContent: component });
    }

    private _redirectCloseModal = (redirect?: string, isModal?: boolean) => {
        if (redirect) {
            this.props.history.push({
                pathname: redirect,
                state: { modal: isModal },
            });
        } else if (this._previousLocation && this._previousLocation.pathname) {
            this.props.history.push({
                pathname: `${this._previousLocation.pathname}`,
                state: { modalClose: true },
            });
        } else {
            this.props.history.push({
                pathname: "/",
                state: { modalClose: true },
            });
        }
    }

    private _closeModal = () => {
        this.setState({ modalContent: null });
    }
}
