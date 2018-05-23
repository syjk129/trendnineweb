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

interface MobileUserProps {
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
            <div className="mobile-user">
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
                <CardContainer gridSize={this.state.gridSize}>
                    {this._renderContent()}
                </CardContainer>
            </div>
        );
    }

    @autobind
    private _renderContent() {
        switch (this.props.contentType) {
        case UserContentType.POST:
        case UserContentType.POST_WISHLIST:
            return this.props.content.map(item => <PostCard post={item} />);
        case UserContentType.PRODUCT:
        case UserContentType.PRODUCT_WISHLIST:
            return this.props.content.map(item => <ProductCard product={item} />);
        case UserContentType.FOLLOWER:
        case UserContentType.FOLLOWING:
            return this.props.content.map(item => <UserCard user={item} following={item.followed} />);
        }
    }
}
