import autobind from "autobind-decorator";
import * as React from "react";

import { Person } from "../../api/models";
import Card, { CardContainer } from "../../components/card";
import Content from "../../components/content";
import Image from "../../components/image";
import NavLink from "../../components/navLink";
import Sidebar from "../../components/sidebar";
import Sticky from "../../components/sticky";
import { PostCard, ProductCard, UserCard } from "../flowComponents/cardView";
import Filter, { FilterTarget } from "../flowComponents/filter";
import { PostRank } from "../flowComponents/ranking";
import { SidebarSection } from "../flowComponents/section";
import Tag from "../flowComponents/tag";
import { Filters, PostParam } from "../model";
import FollowButton from "./followButton";
import UserTabs from "./userTabs";

import { UserContentType } from "./types";

interface DesktopUserProps {
   user: Person;
   userId: string;
   profile: any;
   content: Array<any>;
   contentType: UserContentType;
   pathname: string;
   postParam: PostParam;
   filterContent(filters: Filters): void;
   sortContent(sortString: string): void;
   setContentType(contentType: UserContentType): void;
}

export default class DesktopUser extends React.Component<DesktopUserProps> {
    render() {
        const {
            user,
            userId,
            profile,
            content,
            contentType,
            pathname,
            postParam,
            filterContent,
            sortContent,
            setContentType,
        } = this.props;

        const influencer = profile ? profile.user : null;

        if (!profile || !content) {
            return "Loading...";
        }

        return (
            <div className="user">
                <Sidebar>
                    {influencer && (
                        <div>
                            <SidebarSection title={influencer.username}>
                                <div className="user-image">
                                    <Image
                                        src={influencer.profile_image_url || "https://www.shareicon.net/data/2016/05/26/771199_people_512x512.png"}
                                        circle
                                        square
                                    />

                                    <div className="activity-container">
                                        <div>
                                            <span className="identifier">TODAY</span>
                                            <span className="count">{profile.today_view_count}</span>
                                        </div>
                                        <div>
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
                                            user={ influencer }
                                        />
                                    </div>
                                )}
                                <div className="social-container">
                                    TODO: SOCIAL links
                                </div>
                            </SidebarSection>
                            <SidebarSection title={`${influencer.first_name}'s Top Posts`}>
                                <PostRank posts={profile.top_posts} hideRanks hideName />
                            </SidebarSection>
                            <SidebarSection title={`${influencer.first_name}'s Top Tags`}>
                                <div className="tag-container">
                                    {profile.top_post_tags.map(tag => (
                                        <Tag tag={tag} />
                                    ))}
                                </div>
                            </SidebarSection>
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
                    {(contentType === UserContentType.POST || contentType === UserContentType.PRODUCT) && (
                        <Sticky id="filters" stickyClassName="sticky-filter-container">
                            <div className="filter-container">
                            {contentType === UserContentType.POST &&
                                <Filter
                                    onApply={filterContent}
                                    filterTarget={FilterTarget.POST}
                                    default={postParam.filters}
                                    className={postParam.keyword !== "" && content.length < 1  ? "hide" : ""} />
                            }
                            {contentType === UserContentType.PRODUCT &&
                               <Filter
                                    onApply={filterContent}
                                    filterTarget={FilterTarget.POST}
                                    default={postParam.filters}
                                    className={postParam.keyword !== "" && content.length < 1  ? "hide" : ""} />
                            }
                            </div>
                        </Sticky>
                    )}
                    <CardContainer>
                        {this._renderContent()}
                    </CardContainer>
                </Content>
            </div>
        );
    }

    @autobind
    private _renderContent() {
        if (this.props.content && this.props.content.length > 0) {
            switch (this.props.contentType) {
            case UserContentType.POST:
            case UserContentType.POST_WISHLIST:
                return this.props.content.map(item => <PostCard post={item} gridSize={1}/>);
            case UserContentType.PRODUCT:
            case UserContentType.PRODUCT_WISHLIST:
                return this.props.content.map(item => <ProductCard product={item} />);
            case UserContentType.FOLLOWER:
            case UserContentType.FOLLOWING:
                return this.props.content.map(item => <UserCard user={item} following={item.followed} />);
            }
        }

        return null;
    }
}
