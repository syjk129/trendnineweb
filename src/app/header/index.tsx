import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
import { withRouter } from "react-router-dom";

import { Category, PostTagType } from "../../api/models";
import { AppContext } from "../../app";
import Button, { ButtonVariant } from "../../components/button";
import RouteProps from "../../flows/routeProps";
import Cookies from "../../util/cookies";
import DesktopHeader from "./desktop";
import MobileHeader from "./mobile";

import "./style.scss";

interface HeaderState {
    styles: Array<any>;
    occasions: Array<any>;
    categories: Array<Category>;
    bannerAction: React.ReactNode | null;
    bannerContent: React.ReactNode | null;
}

interface HeaderProps extends RouteProps {
    loggedIn: boolean;
}

class Header extends React.Component<HeaderProps, HeaderState> {
    static contextTypes: AppContext;

    state: HeaderState = {
        styles: [],
        occasions: [],
        categories: [],
        bannerAction: null,
        bannerContent: null,
    };

    async componentWillMount() {
        if (!Cookies.cookieExists("dismissed_welcome")) {
            this.setState({
                bannerAction: <Button inline small variant={ButtonVariant.TOP}>Join Now</Button>,
                bannerContent: <span className="banner-text">Your one-stop destination to <b>discover</b> and <b>shop</b> the hottest trends in social media.</span>,
            });
        }

        const [
            styles,
            occasions,
            categories,
        ] = await Promise.all([
            this.context.api.getPostTags(PostTagType.STYLE),
            this.context.api.getPostTags(PostTagType.OCCASION),
            this.context.api.getCategories(),
        ]);

        const womensCategories = categories.find(category => category.id === "70668ef0-7a13-41b1-8cda-c28b67e8098a");

        this.setState({
            styles,
            occasions,
            categories: womensCategories && womensCategories.subcategories,
        });
    }

    render() {
        return (
            <div>
                <BrowserView device={isBrowser}>
                    <DesktopHeader
                        {...this.props}
                        {...this.state}
                        bannerAction={this.state.bannerAction}
                        bannerContent={this.state.bannerContent}
                        dismissBanner={this._dismissBanner}
                    />
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobileHeader
                        {...this.props}
                        {...this.state}
                        bannerAction={this.state.bannerAction}
                        bannerContent={this.state.bannerContent}
                        dismissBanner={this._dismissBanner}
                    />
                </MobileView>
            </div>
        );
    }

    private _dismissBanner = () => {
        Cookies.setCookie("dismissed_welcome", "true");
        this.setState({ bannerAction: null, bannerContent: null });
    }
}

Header.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};

export default withRouter(Header);
