import autobind from "autobind-decorator";
import * as React from "react";

import { Person } from "../../api/models";
import { CardContainer } from "../../components/card";
import Image from "../../components/image";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import { LookCard, ShopCard, UserCard } from "../flowComponents/cardView";
import Tag from "../flowComponents/tag";
import { Filters, PostParam } from "../model";
import RouteProps from "../routeProps";
import Analytics from "./analytics";
import FollowButton from "./followButton";
import UserTabs from "./userTabs";

import Settings from "./settings";
import { UserContentType } from "./types";

interface MobileUserProps extends RouteProps {
   user: Person;
   userId: string;
   profile: any;
   content: Array<any>;
   contentType: UserContentType;
   loadingNext: boolean;
   nextToken: string | null;
   pathname: string;
   postParam: PostParam;
   filterContent(filters: Filters): void;
   sortContent(sortString: string): void;
   setContentType(contentType: UserContentType): void;
   fetchNextContent(): void;
}

interface MobileUserState {
    gridSize: number;
}

export default class MobileUser extends React.Component<MobileUserProps, MobileUserState> {
    state: MobileUserState = {
        gridSize: 2,
    };

    componentWillMount() {
        this._pageRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener("scroll", this._fetchNextContent);
        document.addEventListener("touchmove", this._fetchNextContent);
    }

    componentDidUnmount() {
        document.removeEventListener("scroll", this._fetchNextContent);
        document.removeEventListener("touchmove", this._fetchNextContent);
    }

    render() {
        const {
            user,
            userId,
            profile,
            content,
            pathname,
            loadingNext,
            setContentType,
        } = this.props;

        if (!content) {
            return <SpinnerContainer><Spinner /></SpinnerContainer>;
        }
        const isInfluencer = profile && profile.user.auth_level === 2;

        return (
            <div className="mobile-user" ref={this._pageRef}>
                {isInfluencer && (
                    this._renderInfluencerProfile(profile)
                )}
                <UserTabs
                    user={user}
                    userId={userId}
                    isSelf={user.id === userId}
                    profile={profile}
                    pathname={pathname}
                    setContent={setContentType}
                />
                {this._renderSettings()}
                {this._renderAnalytics()}
                <CardContainer gridSize={this.state.gridSize}>
                    {this._renderContent()}
                </CardContainer>
                {loadingNext && <Spinner />}
            </div>
        );
    }

    private _pageRef: React.RefObject<HTMLDivElement>;

    private _fetchNextContent = () => {
        // Infinite Scroll
        const page = this._pageRef.current;
        if (!page || page.getBoundingClientRect().bottom > window.innerHeight + 100) {
            return;
        }

        this.props.fetchNextContent();
    }

    private _renderInfluencerProfile = (profile: any) => {
        const influencer = profile.user;
        if (!influencer) {
            return null;
        }

        return (
            <>
                <div className="influencer">
                    <Image
                        className="user-image"
                        src={influencer.profile_small_image_url || "https://www.shareicon.net/data/2016/05/26/771199_people_512x512.png"}
                        circle
                        square
                    />
                    <div className="influencer-details">
                        <h2>{`${influencer.first_name} ${influencer.last_name}`}</h2>
                        <p>@{influencer.username}</p>
                        <div className="activity-container">
                            <div className="activity-item">
                                <span className="count">{profile.follower_count}</span>
                                <span className="identifier">FOLLOWERS</span>
                            </div>
                            <div className="activity-item">
                                <span className="count">{profile.blog_post_count}</span>
                                <span className="identifier">POSTS</span>
                            </div>
                            <div className="activity-item">
                                <span className="count">{profile.product_count}</span>
                                <span className="identifier">PRODUCTS</span>
                            </div>
                        </div>
                        {this.props.user.id !== influencer.id && (
                            <div className="follow-container">
                                <FollowButton
                                    followed={profile.followed}
                                    user={ influencer }
                                />
                            </div>
                        )}
                    </div>
                </div>
                {profile.top_post_tags && profile.top_post_tags.length > 0  &&
                    <>
                        <div className="top-tags">TOP TAGS</div>
                        <div className="tag-container">
                            {profile.top_post_tags.map(tag => (
                                <Tag tag={tag} />
                            ))}
                        </div>
                    </>
                }
            </>
        );
    }

    @autobind
    private _renderSettings() {
        if (this.props.contentType === UserContentType.SETTINGS) {
            return (<Settings />);
        }

        return null;
    }

    private _renderAnalytics = () => {
        if (this.props.contentType === UserContentType.ANALYTICS) {
            return <Analytics />;
        }
    }

    @autobind
    private _renderContent() {
        if (this.props.content && this.props.content.length > 0) {
            switch (this.props.contentType) {
            case UserContentType.POST:
            case UserContentType.POST_WISHLIST:
                return this.props.content.map(item => <LookCard look={item} gridSize={this.state.gridSize} />);
            case UserContentType.PRODUCT:
            case UserContentType.PRODUCT_WISHLIST:
                return this.props.content.map(item => <ShopCard product={item} gridSize={this.state.gridSize} referrerId={this.props.userId} />);
            case UserContentType.FOLLOWER:
            case UserContentType.FOLLOWING:
                return this.props.content.map(item => <UserCard user={item} following={item.followed} />);
            }
        }

        switch (this.props.contentType) {
        case UserContentType.POST_WISHLIST:
            return "You have no bookmarked posts";
        case UserContentType.POST:
            return "There are no posts for this user";
        case UserContentType.PRODUCT_WISHLIST:
            return "You have no wishlisted products";
        case UserContentType.PRODUCT:
            return "There are no products for this user";
        case UserContentType.FOLLOWING:
            return "You are not following anyone";
        }
        return null;
    }
}
