import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
import { Helmet } from "react-helmet";

import { AppContext } from "../../app";
import { ButtonVariant, LinkButton } from "../../components/button";
import Content from "../../components/content";
import Icon, { IconSize, IconVariant } from "../../components/icon";
import Image from "../../components/image";
import Input, { InputType, InputVariant } from "../../components/input";
import ScrollTo from "../../components/scrollTo";
import Sidebar from "../../components/sidebar";
import RouteProps from "../../flows/routeProps";
import PageNavigation from "../flowComponents/pageNavigation";
import { SidebarSection } from "../flowComponents/section";

import "./style.scss";

type Props = RouteProps;

interface OpportunitiesState {
    full_name: string;
    email: string;
    instagram_username: string;
    blog_url: string;
    success: boolean;
}

export default class Opportunities extends React.Component<Props, OpportunitiesState> {
    static contextTypes: AppContext;

    state: OpportunitiesState = {
        full_name: "",
        email: "",
        instagram_username: "",
        blog_url: "",
        success: false,
    };

    render() {
        const pathname = location.pathname;
        const isShop = pathname.indexOf("/shop") > -1;
        const prevPage = isShop ? "Shop" : "Discover";
        const prevPageUrl = isShop ? "/shop" : "/";

        return (
            <>
                <Helmet defer={false}>
                    <title>About</title>
                    <meta name="description" content="Publish, connect, and monetize your style content on TrendNine." />
                </Helmet>
                <div className={isMobile ? "static-content mobile-static-content" : "static-content"}>
                    <PageNavigation />
                    <BrowserView viewClassName="flex" device={isBrowser}>
                        <Sidebar>
                            <LinkButton to={prevPageUrl}>{prevPage}</LinkButton>&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;I'm an Influencer
                        </Sidebar>
                        <Content>
                            {this._renderContent()}
                        </Content>
                    </BrowserView>
                    <MobileView device={isMobile}>
                        <div className="mobile-link-button">
                            <LinkButton to={prevPageUrl}>{prevPage}</LinkButton>&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;I'm an Influencer
                    </div>
                        {this._renderContent()}
                    </MobileView>
                </div>
            </>
        );
    }

    @autobind
    private _renderContent() {
        const pathname = location.pathname;
        const isShop = pathname.indexOf("/shop") > -1;

        return (
            <div>
                <div className="opportunities-header">
                    <h3 className="opportunities-header-title">
                        Are you a fashion blogger, <br />
                        photographer, or style leader?
                    </h3>
                    <p>We’re inviting a select group of top fashion influencers for partnerships. Apply for an invitation to join the exclusive network today.</p>
                    <LinkButton className="button rounded" onClick={() => ScrollTo({ id: "applyNow", offsetY: 0 })}>Apply now</LinkButton>
                </div>
                <div className="opportunities-information-section">
                    <div className="opportunities-section">
                        <p className="opportunities-section-title">A Commerce-Driven Marketing Platform for Influencers</p>
                        <p>
                            Publish and monetize your social media accounts, blogs, and style content on TrendNine. <br />
                            TrendNine is designed to maximize opportunities for discovery, engagement, and sales.
                            </p>
                    </div>
                    <div className="opportunities-section">
                        <p className="opportunities-section-title">TrendNine Influencer Benefits</p>
                        <div className="influencer-benefits">
                            <div className="benefit-content">
                                <div className="benefit-icon-container">
                                    <Icon variant={IconVariant.BRANDING} size={IconSize.LARGE} />
                                </div>
                                <p className="benefit-content-title">MAXIMIZE YOUR BRAND POTENTIAL</p>
                                <p>TrendNine’s marketing ecosystem helps you reach the right audience effectively. Build authentic connections with shoppers and your future fans looking to be inspired.</p>
                            </div>
                            <div className="benefit-content">
                                <div className="benefit-icon-container">
                                    <Icon variant={IconVariant.MONETIZE} size={IconSize.LARGE} />
                                </div>
                                <p className="benefit-content-title">POWERFUL MONETIZATION PLATFORM</p>
                                <p>TrendNine presents your style content in the most optimal shopping environment, allowing shoppers to discover, explore, and make purchases in just a few clicks. Earn revenue every time a shopper clicks your outfit. </p>
                            </div>
                            <div className="benefit-content">
                                <div className="benefit-icon-container">
                                    <Icon variant={IconVariant.AUTOMATED} size={IconSize.LARGE} />
                                </div>
                                <p className="benefit-content-title">AUTOMATED CONTENT INTEGRATION</p>
                                <p>TrendNine automatically integrates your content from your blog or Instagram. So there is no uploading, tagging, or linking on your part. Keep control of your content, and gain additional exposure and revenue with no extra work.</p>
                            </div>
                            <div className="benefit-content">
                                <div className="benefit-icon-container">
                                    <Icon variant={IconVariant.ANALYTICS} size={IconSize.LARGE} />
                                </div>
                                <p className="benefit-content-title">INNOVATIVE TOOLS AND ANALYTICS</p>
                                <p>Whether you want to track your performance or monetize your blog or social media followers, TrendNine provides easy-to-use tools and dashboards to grow your business and brand. </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="opportunities-apply-section">
                    <form id="applyNow" onSubmit={this._submit}>
                        <p className="form-header">Apply now to be a Trendnine Influencer.</p>
                        <Input
                            value={this.state.full_name}
                            onChange={(full_name) => this._onInputChange({ full_name })}
                            variant={InputVariant.OUTLINE}
                            required={true}
                            placeholder="Full Name*" />
                        <Input
                            value={this.state.email}
                            onChange={(email) => this._onInputChange({ email })}
                            variant={InputVariant.OUTLINE}
                            type={InputType.EMAIL}
                            required={true}
                            placeholder="Email*" />
                        <Input
                            value={this.state.instagram_username}
                            onChange={(instagram_username) => this._onInputChange({ instagram_username })}
                            variant={InputVariant.OUTLINE}
                            required={true}
                            placeholder="Instagram Username*" />
                        <Input
                            value={this.state.blog_url}
                            onChange={(blog_url) => this._onInputChange({ blog_url })}
                            variant={InputVariant.OUTLINE}
                            placeholder="Blog Url" />
                        <p className="signup-disclaimer">
                            By signing up, you agree to TrendNine’s&nbsp;
                                <LinkButton inline={true} to={isShop ? "/shop/terms" : "terms"} target="_blank">
                                Terms of Service
                                </LinkButton>&nbsp;and&nbsp;
                                <LinkButton inline={true} to={isShop ? "/shop/privacy" : "privacy"} target="_blank">
                                Privacy Policy
                                </LinkButton>.</p>
                        <Input className="rounded" type={InputType.SUBMIT} value="APPLY NOW" />
                    </form>
                    {this.state.success && (<p>Successful!</p>)}
                </div>
            </div>
        );
    }

    @autobind
    private _onInputChange(data) {
        this.setState(data);
    }

    @autobind
    private async _submit(event) {
        event.preventDefault();
        const response = await this.context.api.applyInfluencer(this.state);
        if (response.email) {
            this.setState({
                full_name: "",
                email: "",
                instagram_username: "",
                blog_url: "",
                success: true,
            });
            setTimeout(function () {
                this.setState({ success: false });
            }.bind(this), 5000);
        }
        return false;
    }
}

Opportunities.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
