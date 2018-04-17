import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match } from "react-router";

import { Person, PostPreview } from "../../api/models";
import { AppContext } from "../../app";
import Card, { CardContainer } from "../../components/card";
import Content from "../../components/content";
import Image from "../../components/image";
import NavLink from "../../components/navLink";
import Sidebar from "../../components/sidebar";
import { PostCard, ProductCard, UserCard } from "../flowComponents/cardView";
import Filter from "../flowComponents/filter";
import { PostRank } from "../flowComponents/ranking";
import { SidebarSection } from "../flowComponents/section";
import Tag from "../flowComponents/tag";

import FollowButton from "./followButton";
import "./style.scss";

interface UserProps {
    match: match<any>;
    location: any;
    followUser(userId: string): void;
}

interface UserState {
    pageName: string;
    profile: any;
    followed: boolean;
    posts: Array<PostPreview>;
    products: Array<any>;
    followers: Array<Person>;
    following: Array<Person>;
}

export default class User extends React.Component<UserProps, UserState> {
    static contextTypes: AppContext;

    state: UserState = {
        pageName: "posts",
        profile: null,
        followed: false,
        posts: [],
        products: [],
        followers: [],
        following: [],
    };

    async componentWillMount() {
        this._userId = this.props.match.params.userId;

        const [
            profile,
            posts,
            products,
            followers,
            following,
        ] = await Promise.all([
            this.context.api.getInfluencer(this._userId),
            this.context.api.getPostsForUser(this._userId),
            this.context.api.getProductsForUser(this._userId),
            this.context.api.getUserFollowers(this._userId),
            this.context.api.getUserFollowing(this._userId),
        ]);

        this.setState({
            pageName: this.props.match.params.pageName || "posts",
            profile,
            followed: profile.followed,
            posts,
            products,
            followers,
            following,
        });
    }

    render() {
        const user = this.state.profile ? this.state.profile.user : null;
        const pathname = this.props.location.pathname;

        return (
            <div className="user">
                <Sidebar>
                    {user && (
                        <div>
                            <SidebarSection title={user.username}>
                                <div className="user-image">
                                    <Image
                                        src={user.profile_image_url || "https://www.shareicon.net/data/2016/05/26/771199_people_512x512.png"}
                                        circle
                                        square
                                    />
                                </div>
                                <p className="introduction">{user.introduction}</p>
                                <FollowButton
                                    followed={this.state.followed}
                                    onClick={this._toggleSubscribe}
                                />
                                <div className="followers">
                                    <div>
                                        <span className="identifier">TODAY</span>
                                        <span className="count">{this.state.profile.today_view_count}</span>
                                    </div>
                                    <div>
                                        <span className="identifier">TOTAL</span>
                                        <span className="count">{this.state.profile.total_view_count}</span>
                                    </div>
                                </div>
                            </SidebarSection>
                            <SidebarSection title={`${user.first_name}'s Top Posts`}>
                                <PostRank posts={this.state.profile.top_posts} />
                            </SidebarSection>
                            <SidebarSection title={`${user.first_name}'s Top Tags`}>
                                {this.state.profile.top_post_tags.map(tag => (
                                    <Tag tag={tag} />
                                ))}
                            </SidebarSection>
                        </div>
                    )}
                </Sidebar>
                <Content>
                    <Filter onApply={() => {}}>
                        {this.state.profile && (
                            <div className="user-nav">
                                <NavLink
                                    url={`/user/${this._userId}`}
                                    pathname={pathname}
                                    onClick={() => this._updatePageName("posts")}
                                >
                                    <p>POSTS</p>
                                    <p>{this.state.profile.blog_post_count}</p>
                                </NavLink>
                                <NavLink
                                    url={`/user/${this._userId}/products`}
                                    pathname={pathname}
                                    onClick={() => this._updatePageName("products")}
                                >
                                    <p>PRODUCTS</p>
                                    <p>{this.state.profile.product_count}</p>
                                </NavLink>
                                <NavLink
                                    url={`/user/${this._userId}/followers`}
                                    pathname={pathname}
                                    onClick={() => this._updatePageName("followers")}
                                >
                                    <p>FOLLOWERS</p>
                                    <p>{this.state.profile.follower_count}</p>
                                </NavLink>
                                <NavLink
                                    url={`/user/${this._userId}/following`}
                                    pathname={pathname}
                                    onClick={() => this._updatePageName("following")}
                                >
                                    <p>FOLLOWING</p>
                                    <p>{this.state.profile.following_count}</p>
                                </NavLink>
                            </div>
                        )}
                    </Filter>
                    <CardContainer>
                        {this._renderContent()}
                    </CardContainer>
                </Content>
            </div>
        );
    }

    private _userId: string;

    @autobind
    private _updatePageName(pageName: string) {
        this.setState({ pageName });
    }

    @autobind
    private _renderContent() {
        switch (this.state.pageName) {
            case "products":
                return this._renderProducts();
            case "followers":
                return this._renderFollowers();
            case "following":
                return this._renderFollowing();
            case "posts":
                return this._renderPosts();
        }
    }

    @autobind
    private _renderPosts() {
        return this.state.posts.map(post => (
            <PostCard
                post={post}
                likePost={this.context.api.likePost}
                unlikePost={this.context.api.unlikePost}
                toggleWishlist={this.context.api.toggleWishlist}
            />
        ));
    }

    @autobind
    private _renderProducts() {
        return this.state.products.map(product => (
            <ProductCard product={product} />
        ));
    }

    @autobind
    private _renderFollowers() {
        return this.state.followers.map(user => (
            <UserCard user={user} />
        ));
    }

    @autobind
    private _renderFollowing() {
        return this.state.following.map(user => (
            <UserCard user={user} />
        ));
    }

    @autobind
    private _toggleSubscribe() {
        try {
            if (this.state.followed) {
                this.context.api.unfollowUser(this._userId);
            } else {
                this.context.api.followUser(this._userId);
            }
        } catch (error) {
            throw new Error(error);
        }

        this.setState({ followed: !this.state.followed });
    }
}

User.contextTypes = {
    api: PropTypes.any,
};
