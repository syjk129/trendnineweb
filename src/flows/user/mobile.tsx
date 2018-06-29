import autobind from "autobind-decorator";
import * as React from "react";

import { Person } from "../../api/models";
import Card, { CardContainer } from "../../components/card";
import Content from "../../components/content";
import Image from "../../components/image";
import NavLink from "../../components/navLink";
import Sidebar from "../../components/sidebar";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import Sticky from "../../components/sticky";
import { PostCard, ProductCard, UserCard } from "../flowComponents/cardView";
import Filter, { FilterTarget } from "../flowComponents/filter";
import MobileFilter from "../flowComponents/filter/mobileFilter";
import { PostRank } from "../flowComponents/ranking";
import { SidebarSection } from "../flowComponents/section";
import Tag from "../flowComponents/tag";
import ViewMore from "../flowComponents/viewMore";
import { Filters, PostParam } from "../model";
import FollowButton from "./followButton";
import UserTabs from "./userTabs";

import Settings from "./settings";
import { UserContentType } from "./types";

interface MobileUserProps {
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
        gridSize: 1,
    };

    render() {
        const {
            user,
            userId,
            profile,
            content,
            contentType,
            loadingNext,
            nextToken,
            pathname,
            postParam,
            filterContent,
            sortContent,
            setContentType,
            fetchNextContent,
        } = this.props;

        const influencer = profile ? profile.user : null;

        if (!profile || !content) {
            return <SpinnerContainer><Spinner /></SpinnerContainer>;
        }

        return (
            <div className="mobile-user">
                <div className="user-name">
                    {influencer.username}
                </div>
                <div className="user-details">
                    <div className="user-image">
                        <Image
                            src={influencer.profile_image_url || "https://www.shareicon.net/data/2016/05/26/771199_people_512x512.png"}
                            circle
                            square
                        />
                    </div>
                    <div className="introduction">
                        {influencer.introduction}
                    </div>
                </div>
                {user.id !== influencer.id && (
                    <div className="follow-container">
                        <FollowButton
                            user={ influencer }
                        />
                    </div>
                )}
                <div className="activity-container">
                    <div className="activity-item">
                        <span className="identifier">TODAY</span>
                        <span className="count">{profile.today_view_count}</span>
                    </div>
                    <div className="activity-item">
                        <span className="identifier">TOTAL</span>
                        <span className="count">{profile.total_view_count}</span>
                    </div>
                </div>

                {(contentType === UserContentType.POST || contentType === UserContentType.PRODUCT) && (
                    <MobileFilter setGridSize={this._setGridSize} />
                )}

                {this._renderSettings()}
                <CardContainer gridSize={this.state.gridSize}>
                    {this._renderContent()}
                </CardContainer>
                {nextToken && <ViewMore isLoading={loadingNext} onClick={fetchNextContent} />}
            </div>
        );
    }

    @autobind
    private _setGridSize(gridSize: number) {
        this.setState({ gridSize });
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
        switch (this.props.contentType) {
        case UserContentType.POST:
        case UserContentType.POST_WISHLIST:
            return this.props.content.map(item => <PostCard post={item} gridSize={this.state.gridSize} />);
        case UserContentType.PRODUCT:
        case UserContentType.PRODUCT_WISHLIST:
            return this.props.content.map(item => <ProductCard product={item} gridSize={this.state.gridSize} />);
        case UserContentType.FOLLOWER:
        case UserContentType.FOLLOWING:
            return this.props.content.map(item => <UserCard user={item} following={item.followed} />);
        }
    }
}
