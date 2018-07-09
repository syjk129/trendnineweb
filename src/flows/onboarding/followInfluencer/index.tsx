import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";

import { Pagination, Person, PostPreview } from "../../../api/models";
import DesktopFollowInfluencer from "./desktop";
import MobileFollowInfluencer from "./mobile";

import "./style.scss";

interface FollowInfluencerProps {
    influencer: Person;
    followed: boolean;
    toggleFollow(): void;
    getPostsForUser(userId: string, queryString?: string): Promise<Pagination<PostPreview>>;
}

interface FollowInfluencerState {
    posts: Array<PostPreview>;
}

export default class FollowInfluencer extends React.Component<FollowInfluencerProps, FollowInfluencerState> {
    state: FollowInfluencerState = {
        posts: [],
    };

    async componentWillMount() {
        const posts = await this.props.getPostsForUser(this.props.influencer.id, "page_size=4");
        this.setState({ posts: posts.list.slice(0, 4) });
    }

    render() {
        return (
            <>
                <BrowserView viewClassName="view-container" device={isBrowser}>
                    <DesktopFollowInfluencer
                        influencer={this.props.influencer}
                        followed={this.props.followed}
                        posts={this.state.posts}
                        toggleFollow={this.props.toggleFollow}
                    />
                </BrowserView>
                <MobileView viewClassName="mobile-view-container" device={isMobile}>
                    <MobileFollowInfluencer
                        influencer={this.props.influencer}
                        followed={this.props.followed}
                        posts={this.state.posts}
                        toggleFollow={this.props.toggleFollow}
                    />
                </MobileView>
            </>
        );
    }
}
