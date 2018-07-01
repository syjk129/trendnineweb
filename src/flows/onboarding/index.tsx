import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";

import { Person } from "../../api/models";
import { AppContext } from "../../app";
import Modal from "../../components/modal";
import RouteProps from "../routeProps";
import DesktopOnboarding from "./desktop";

import "./style.scss";

interface OnboardingProps extends RouteProps {
    close(redirect?: string): void;
}

interface OnboardingState {
    influencers: Array<Person>;
    followed: Array<string>;
}

export default class Onboarding extends React.Component<OnboardingProps, OnboardingState> {
    static contextTypes: AppContext;

    state: OnboardingState = {
        influencers: [],
        followed: [],
    };

    async componentWillMount() {
        const influencers = await this.context.api.getFeaturedTrendnines();
        this.setState({ influencers });
    }

    render() {
        return (
            <Modal className="onboarding-modal" isOpen close={this.props.close}>
                <BrowserView device={isBrowser}>
                    <DesktopOnboarding
                        {...this.state}
                        followInfluencer={this._followInfluencer}
                        getPostsForUser={this._getPostsForUser}
                        close={this.props.close}
                        unfollowAll={this._unfollowAll}
                    />
                </BrowserView>
                <MobileView device={isMobile}>
                </MobileView>
            </Modal>
        );
    }

    private _unfollowAll = () => {
        this.setState({ followed: [] });
        this.state.followed.forEach(followedInfluencer => this.context.api.unfollowUser(followedInfluencer));
    }

    private _followInfluencer = (influencer: Person) => {
        let followed = this.state.followed;
        followed.push(influencer.id);
        this.setState({ followed });
        return this.context.api.followUser(influencer.id);
    }

    private _getPostsForUser = (userId: string, queryString?: string) => {
        return this.context.api.getPostsForUser(userId, queryString);
    }
}

Onboarding.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
