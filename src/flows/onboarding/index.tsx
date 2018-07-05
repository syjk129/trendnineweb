import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";

import { FeaturedInfluencer, Person } from "../../api/models";
import { AppContext } from "../../app";
import Modal from "../../components/modal";
import RouteProps from "../routeProps";
import DesktopOnboarding from "./desktop";
import MobileOnboarding from "./mobile";

import "./style.scss";

interface OnboardingProps extends RouteProps {
    close(redirect?: string): void;
}

interface OnboardingState {
    influencers: Array<FeaturedInfluencer>;
    followed: Set<string>;
}

export default class Onboarding extends React.Component<OnboardingProps, OnboardingState> {
    static contextTypes: AppContext;

    state: OnboardingState = {
        influencers: [],
        followed: new Set(),
    };

    async componentWillMount() {
        const influencers = await this.context.api.getTodaysTrendnines();
        this.setState({ influencers });
    }

    render() {
        return (
            <Modal className="onboarding-modal" isOpen close={this.props.close}>
                <BrowserView device={isBrowser}>
                    <DesktopOnboarding
                        {...this.state}
                        toggleFollowInfluencer={this._toggleFollowInfluencer}
                        getPostsForUser={this._getPostsForUser}
                        close={this.props.close}
                        unfollowAll={this._unfollowAll}
                    />
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobileOnboarding
                        {...this.state}
                        toggleFollowInfluencer={this._toggleFollowInfluencer}
                        getPostsForUser={this._getPostsForUser}
                        close={this.props.close}
                        unfollowAll={this._unfollowAll}
                    />
                </MobileView>
            </Modal>
        );
    }

    private _unfollowAll = () => {
        this.setState({ followed: new Set() });
        this.state.followed.forEach(followedInfluencer => this.context.api.unfollowUser(followedInfluencer));
    }

    private _toggleFollowInfluencer = async (influencer: Person) => {
        let followed = this.state.followed;
        if (followed.has(influencer.id)) {
            followed.delete(influencer.id);
            await this.context.api.unfollowUser(influencer.id);
        } else {
            followed.add(influencer.id);
            await this.context.api.followUser(influencer.id);
        }
        this.setState({ followed });
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
