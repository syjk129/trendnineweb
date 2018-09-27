import autobind from "autobind-decorator";
import * as React from "react";

import { Person } from "../../api/models";
import { CardContainer } from "../../components/card";
import { SocialIcon, SocialIconType } from "../../components/icon";
import Image from "../../components/image";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import { LookCard, ShopCard, UserCard } from "../flowComponents/cardView";
import { SidebarSection } from "../flowComponents/section";
import Tag from "../flowComponents/tag";
import ViewMore from "../flowComponents/viewMore";
import { Filters, PostParam } from "../model";
import Analytics from "./analytics";
import FollowButton from "./followButton";
import Settings from "./settings";
import UserTabs from "./userTabs";

import { UserContentType } from "./types";

interface DesktopUserProps {
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

export default class DesktopUser extends React.Component<DesktopUserProps> {
    render() {
        const {
            user,
            userId,
            profile,
            content,
            loadingNext,
            nextToken,
            pathname,
            setContentType,
            fetchNextContent,
        } = this.props;

        const influencer = profile ? profile.user : null;

        const isInfluencer = user.auth_level === 2;

        if (!content && !(isInfluencer && influencer)) {
            return <SpinnerContainer><Spinner /></SpinnerContainer>;
        }

        return (
            <div className="user">
                {influencer && (
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
                            {user.id !== influencer.id && (
                                <div className="follow-container">
                                    <FollowButton
                                        followed={profile.followed}
                                        user={ influencer }
                                    />
                                </div>
                            )}
                            </div>
                        </div>
                        {/* <div className="social-container">
                            {influencer.blog_url && (
                                <LinkButton href={influencer.blog_url} target="_blank"><SocialIcon icon={SocialIconType.INSTAGRAM} /></LinkButton>
                            )}
                            {influencer.instagram_url && (
                                <LinkButton href={influencer.instagram_url} target="_blank"><SocialIcon icon={SocialIconType.INSTAGRAM} /></LinkButton>
                            )}
                            {influencer.youtube_url && (
                                <LinkButton href={influencer.youtube_url} target="_blank"><SocialIcon icon={SocialIconType.INSTAGRAM} /></LinkButton>
                            )}
                        </div> */}
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
                )}
                <UserTabs
                    user={user}
                    userId={userId}
                    isSelf={user.username === userId}
                    profile={profile}
                    pathname={pathname}
                    setContent={setContentType}
                />
                {this._renderSettings()}
                {this._renderAnalytics()}
                <CardContainer>
                    {this._renderContent()}
                </CardContainer>
                {nextToken && <ViewMore isLoading={loadingNext} onClick={fetchNextContent} />}
            </div>
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
            const referrerId = this.props.profile && this.props.profile.user ? this.props.profile.user.id : null;
            switch (this.props.contentType) {
            case UserContentType.POST_WISHLIST:
            case UserContentType.POST:
                return this.props.content.map(item => <LookCard look={item} />);
            case UserContentType.PRODUCT_WISHLIST:
            case UserContentType.PRODUCT:
                return this.props.content.map(item => <ShopCard product={item} referrerId={referrerId} />);
            case UserContentType.FOLLOWING:
            case UserContentType.FOLLOWER:
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
