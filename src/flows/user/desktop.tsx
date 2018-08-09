import autobind from "autobind-decorator";
import * as React from "react";

import { Person } from "../../api/models";
import { CardContainer } from "../../components/card";
import Content from "../../components/content";
import Image from "../../components/image";
import Sidebar from "../../components/sidebar";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import { PostCard, ProductCard, UserCard } from "../flowComponents/cardView";
import { PostRank } from "../flowComponents/ranking";
import { SidebarSection } from "../flowComponents/section";
import Tag from "../flowComponents/tag";
import ViewMore from "../flowComponents/viewMore";
import { Filters, PostParam } from "../model";
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
                <Sidebar>
                    {influencer && (
                        <div>
                            <SidebarSection title={influencer.username}>
                                <div className="user-image">
                                    <Image
                                        src={influencer.profile_small_image_url || "https://www.shareicon.net/data/2016/05/26/771199_people_512x512.png"}
                                        circle
                                        square
                                    />
                                    <div className="activity-container">
                                        <div className="activity-item">
                                            <span className="identifier">FOLLOWERS</span>
                                            <span className="count">{profile.follower_count}</span>
                                        </div>
                                        <div className="activity-item">
                                            <span className="identifier">TODAY</span>
                                            <span className="count">{profile.today_view_count}</span>
                                        </div>
                                        <div className="activity-item">
                                            <span className="identifier">TOTAL</span>
                                            <span className="count">{profile.total_view_count}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="introduction">
                                    {influencer.introduction}
                                </div>
                                {user.id !== influencer.id && (
                                    <div className="follow-container">
                                        <FollowButton
                                            followed={profile.followed}
                                            user={ influencer }
                                        />
                                    </div>
                                )}
                                {/* <div className="social-container">
                                    TODO: SOCIAL links
                                </div> */}
                            </SidebarSection>
                            {profile.top_posts && profile.top_posts.length > 0 &&
                                <SidebarSection title={`${influencer.first_name}'s Top Posts`}>
                                    <PostRank posts={profile.top_posts} hideRanks hideName />
                                </SidebarSection>
                            }
                            {profile.top_post_tags && profile.top_post_tags.length > 0  &&
                                <SidebarSection title={`${influencer.first_name}'s Top Tags`}>
                                    <div className="tag-container">
                                        {profile.top_post_tags.map(tag => (
                                            <Tag tag={tag} />
                                        ))}
                                    </div>
                                </SidebarSection>
                            }
                        </div>
                    )}
                </Sidebar>
                <Content>
                    <UserTabs
                        userId={userId}
                        isSelf={user.username === userId}
                        profile={profile}
                        pathname={pathname}
                        setContent={setContentType}
                    />
                    {this._renderSettings()}
                    <CardContainer>
                        {this._renderContent()}
                    </CardContainer>
                    {nextToken && <ViewMore isLoading={loadingNext} onClick={fetchNextContent} />}
                </Content>
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

    @autobind
    private _renderContent() {
        if (this.props.content && this.props.content.length > 0) {
            const referrerId = this.props.profile && this.props.profile.user ? this.props.profile.user.id : null;
            switch (this.props.contentType) {
            case UserContentType.POST_WISHLIST:
            case UserContentType.POST:
                return this.props.content.map(item => <PostCard post={item} />);
            case UserContentType.PRODUCT_WISHLIST:
            case UserContentType.PRODUCT:
                return this.props.content.map(item => <ProductCard product={item} referrerId={referrerId} />);
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
