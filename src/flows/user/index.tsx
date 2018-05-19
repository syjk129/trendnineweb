import autobind from "autobind-decorator";
import * as H from "history";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match } from "react-router";

import { Person, PostPreview } from "../../api/models";
import { AppContext, AppContextTypes } from "../../app";
import Card, { CardContainer } from "../../components/card";
import Content from "../../components/content";
import Image from "../../components/image";
import NavLink from "../../components/navLink";
import Sidebar from "../../components/sidebar";
import { Sticky } from "../../components/sticky";
import { PostCard, ProductCard, UserCard } from "../flowComponents/cardView";
import Filter, { FilterTarget } from "../flowComponents/filter";
import { PostRank } from "../flowComponents/ranking";
import { SidebarSection } from "../flowComponents/section";
import Tag from "../flowComponents/tag";
import { Filters } from "../model/filters";
import { PostParam } from "../model/post-param";

import FollowButton from "./followButton";
import "./style.scss";

interface UserProps {
    history: H.History;
    user: Person;
    match: match<any>;
    location: any;
    followUser(userId: string): void;
}

interface UserState {
    pageName: string;
    postsNextToken: string;
    productsNextToken: string;
    followersNextToken: string;
    followingsNextToken: string;
    profile: any;
    posts: Array<PostPreview>;
    products: Array<any>;
    followers: Array<Person>;
    following: Array<Person>;
    wishlist: any;
    postParam: PostParam;
}

export default class User extends React.Component<UserProps, UserState> {
    static contextTypes: AppContext;

    state: UserState = {
        pageName: "posts",
        postsNextToken: "",
        productsNextToken: "",
        followersNextToken: "",
        followingsNextToken: "",
        profile: null,
        posts: [],
        products: [],
        followers: [],
        following: [],
        wishlist: null,
        postParam: null,
    };

    componentWillMount() {
        this.refreshContent(this.props);
    }

    componentWillReceiveProps(props: UserProps) {
        this.refreshContent(props);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll, false);
    }

    componentDidUnmount() {
        window.removeEventListener("scroll", this.onScroll, false);
    }

    async refreshContent(props: UserProps) {
        const params = new URLSearchParams(location.search);
        const postParam = new PostParam(params);
        const queryString = postParam.convertUrlParamToQueryString();
        this._userId = this.props.match.params.userId;
        this._user = JSON.parse(localStorage.getItem("user"));

        const [
            profile,
            posts,
            products,
            followers,
            following,
            wishlist,
        ] = await Promise.all([
            this.context.api.getInfluencer(this._userId),
            this.context.api.getPostsForUser(this._userId),
            this.context.api.getProductsForUser(this._userId),
            this.context.api.getUserFollowers(this._userId),
            this.context.api.getUserFollowing(this._userId),
            this._user.username === this._userId ? this.context.api.getWishlist() : null,
        ]);

        this.setState({
            pageName: this.props.match.params.pageName || "posts",
            profile,
            posts,
            postsNextToken: posts.nextToken,
            products,
            productsNextToken: products.nextToken,
            followers,
            followersNextToken: followers.nextToken,
            following,
            followingsNextToken: following.nextToken,
            wishlist,
            postParam: postParam,
        });
    }

    onScroll = () => {
        let scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        let scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        let clientHeight = document.documentElement.clientHeight || window.innerHeight;
        let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
        if (scrolledToBottom) {
            this._paginateNextPosts();
            this._paginateNextProducts();
            this._paginateNextFollowers();
            this._paginateNextFollowings();
        }
    }


    render() {
        const influencer = this.state.profile ? this.state.profile.user : null;
        const pathname = this.props.location.pathname;

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
                                </div>
                                <div className="introduction">
                                    {influencer.introduction}
                                </div>
                                {this._user.id !== influencer.id && (
                                    <div className="follow-container">
                                        <FollowButton
                                            user={ influencer }
                                        />
                                    </div>
                                )}
                                <div className="activity-container">
                                    <div>
                                        <span className="identifier">TODAY</span>
                                        <span className="count">{this.state.profile.today_view_count}</span>
                                    </div>
                                    <div>
                                        <span className="identifier">TOTAL</span>
                                        <span className="count">{this.state.profile.total_view_count}</span>
                                    </div>
                                </div>
                                <div className="social-container">
                                    TODO: SOCIAL links
                                </div>
                            </SidebarSection>
                            <SidebarSection title={`${influencer.first_name}'s Top Posts`}>
                                <PostRank posts={this.state.profile.top_posts} hideRanks hideName />
                            </SidebarSection>
                            <SidebarSection title={`${influencer.first_name}'s Top Tags`}>
                                <div className="tag-container">
                                    {this.state.profile.top_post_tags.map(tag => (
                                        <Tag tag={tag} />
                                    ))}
                                </div>
                            </SidebarSection>
                        </div>
                    )}
                </Sidebar>
                <Content>
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
                            {this._user.username === this._userId &&
                                <NavLink
                                    url={`/user/${this._userId}/post-wishlist`}
                                    pathname={pathname}
                                    onClick={() => this._updatePageName("post-wishlist")}
                                >
                                    <p>WISHLIST (Posts)</p>
                                    <p>&nbsp;</p>
                                </NavLink>
                            }
                            {this._user.username === this._userId &&
                                <NavLink
                                    url={`/user/${this._userId}/product-wishlist`}
                                    pathname={pathname}
                                    onClick={() => this._updatePageName("product-wishlist")}
                                >
                                    <p>WISHLIST (Products)</p>
                                    <p>&nbsp;</p>
                                </NavLink>
                            }
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
                    {this.state.profile && (this.state.pageName === "posts" || this.state.pageName === "products") && (
                        <Sticky id="filters" stickyClassName="sticky-filter-container">
                            <div className="filter-container">
                            {
                                this.state.pageName === "posts" &&
                                <Filter
                                    onApply={this._filterPosts}
                                    filterTarget={FilterTarget.POST}
                                    default={this.state.postParam.filters}
                                    className={this.state.postParam.keyword !== "" && this.state.posts.length < 1  ? "hide" : ""} />
                            }
                            {
                                this.state.pageName === "products" &&
                               <Filter
                                    onApply={this._filterPosts}
                                    filterTarget={FilterTarget.POST}
                                    default={this.state.postParam.filters}
                                    className={this.state.postParam.keyword !== "" && this.state.products.length < 1  ? "hide" : ""} />
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

    private _userId: string;

    private _user: Person;

    @autobind
    private _updatePageName(pageName: string) {
        this.setState({
            pageName,
            postParam: new PostParam(new URLSearchParams()),
         });
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
            case "product-wishlist":
                return this._renderProductWishlist();
            case "post-wishlist":
                return this._renderPostWishlist();
        }
    }

    @autobind
    private _renderPostWishlist() {
        return this.state.wishlist.post_items.map(post => (
            <PostCard post={post} />
        ));
    }

    @autobind
    private _renderProductWishlist() {
        return this.state.wishlist.product_items.map(product => (
            <ProductCard product={product} />
        ));
    }

    @autobind
    private _renderPosts() {
        return this.state.posts.map(post => (
            <PostCard post={post} />
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
        return this.state.followers.map(person => (
            <UserCard user={person} following={person.followed } />
        ));
    }

    @autobind
    private _renderFollowing() {
        return this.state.following.map(person => (
            <UserCard user={person} following={person.followed } />
        ));
    }

    @autobind
    private async _filterPosts(filters: Filters) {
        this.state.postParam.filters = filters;
        this._push(this.state.postParam);
    }

    @autobind
    private async _sortPosts(sortString: string) {
        this.state.postParam.sort = sortString;
        this._push(this.state.postParam);
    }

    @autobind
    private async _push(postParams: PostParam) {
        this.props.history.push({
            pathname: location.pathname,
            search: `?${postParams.convertToUrlParamString()}`,
        });
    }

    @autobind
    private async _paginateNextPosts() {
        if (this.state.postsNextToken == null || this.state.pageName !== "posts") {
            return;
        }

        const queryString = this.state.postParam ? this.state.postParam.convertUrlParamToQueryString() : "";
        const newPosts = await Promise.resolve(
            this.context.api.getPostsForUser(this._userId, queryString, this.state.postsNextToken));
        this.setState({
            posts: this.state.posts.concat(newPosts.list).filter((post, index, arr) => {
                return arr.map(mapPost => mapPost["id"]).indexOf(post["id"]) === index;
            }),
            postsNextToken: newPosts.nextToken,
        });
    }

    @autobind
    private async _paginateNextProducts() {
        if (this.state.productsNextToken == null || this.state.pageName !== "products") {
            return;
        }

        const queryString = this.state.postParam ? this.state.postParam.convertUrlParamToQueryString() : "";
        const newProducts = await Promise.resolve(
            this.context.api.getProductsForUser(this._userId, queryString, this.state.productsNextToken));
        this.setState({
            products: this.state.products.concat(newProducts.list).filter((product, index, arr) => {
                return arr.map(mapProduct => mapProduct["id"]).indexOf(product["id"]) === index;
            }),
            productsNextToken: newProducts.nextToken,
        });
    }

    @autobind
    private async _paginateNextFollowings() {
        if (this.state.followingsNextToken == null || this.state.pageName !== "following") {
            return;
        }

        const newFollowings = await Promise.resolve(
            this.context.api.getUserFollowing(this._userId, this.state.productsNextToken));
        this.setState({
            following: this.state.following.concat(newFollowings.list).filter((person, index, arr) => {
                return arr.map(mapPerson => mapPerson["id"]).indexOf(person["id"]) === index;
            }),
            followingsNextToken: newFollowings.nextToken,
        });
    }

    @autobind
    private async _paginateNextFollowers() {
        if (this.state.followersNextToken == null || this.state.pageName !== "followers") {
            return;
        }

        const newFollowers = await Promise.resolve(
            this.context.api.getUserFollowers(this._userId, this.state.productsNextToken));
        this.setState({
            followers: this.state.followers.concat(newFollowers.list).filter((person, index, arr) => {
                return arr.map(mapPerson => mapPerson["id"]).indexOf(person["id"]) === index;
            }),
            followersNextToken: newFollowers.nextToken,
        });
    }
}

User.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
};
