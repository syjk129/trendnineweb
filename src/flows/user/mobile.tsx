import autobind from "autobind-decorator";
import * as React from "react";

import { Person } from "../../api/models";
import Card, { CardContainer } from "../../components/card";
import Image from "../../components/image";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import { PostCard, ProductCard, UserCard } from "../flowComponents/cardView";
import ContentToolbar from "../flowComponents/contentToolbar";
import ViewMore from "../flowComponents/viewMore";
import { Filters, PostParam } from "../model";
import RouteProps from "../routeProps";
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
        gridSize: 1,
    };

    render() {
        const {
            user,
            userId,
            profile,
            content,
            pathname,
            contentType,
            loadingNext,
            nextToken,
            setContentType,
            fetchNextContent,
        } = this.props;

        if (!content) {
            return <SpinnerContainer><Spinner /></SpinnerContainer>;
        }
        console.log(user);
        const isInfluencer = profile && profile.user.auth_level === 2;

        return (
            <div className="mobile-user">
                {isInfluencer && (
                    this._renderInfluencerProfile(profile)
                )}
                <UserTabs
                    userId={userId}
                    isSelf={user.id === userId}
                    profile={profile}
                    pathname={pathname}
                    setContent={setContentType}
                />
                {/* {(contentType === UserContentType.POST || contentType === UserContentType.PRODUCT) && (
                    <ContentToolbar
                        location={this.props.location}
                        history={this.props.history}
                        match={this.props.match}
                        contentType={contentType}
                        setGridSize={this._setGridSize}
                    />
                )} */}

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

    private _renderInfluencerProfile = (profile: any) => {
        const influencer = profile.user;
        if (!influencer) {
            return null;
        }

        return (
            <>
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
                <div className="follow-container">
                    <FollowButton
                        followed={profile.followed}
                        user={ influencer }
                    />
                </div>
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
            </>
        );
    }

    private _renderUserProfile = () => {
        return (
            <>
                <div className="user-name">
                </div>
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
