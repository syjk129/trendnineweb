import "whatwg-fetch";

import Cookies from "../util/cookies";
import {
    Brand,
    Category,
    Comment,
    Featured,
    FeaturedInfluencer,
    Pagination,
    Person,
    Post,
    PostPreview,
    Posts,
    PostTagType,
    Products,
    Retailer,
    Tag,
} from "./models";

import {
    createErrorFromResponse,
    isAuthError,
} from "./errors";

import {
    ArticleRequest,
    PostRequest,
    PresignedPostRequest,
    ResultRequest,
} from "./requests";

import {
    ProductClicksResponse,
} from "./responses";
import { PostType } from "../flows/cms/types";

export interface ApiOptions {
    apiUrl: string;
    setError(error: Error): void;
}

const tokenName = "tn_auth_token";

export default class Api {
    constructor(options: ApiOptions) {
        this._apiOptions = options;
        this._apiUrl = options.apiUrl;
    }

    authenticate(email: string, password: string, isNewUser: boolean, firstName?: string, lastName?: string): Promise<void> {
        let request;
        if (isNewUser) {
            request = { email, password, first_name: firstName, last_name: lastName };
            return this._POST_UNAUTHORIZED("/api/v1/users/registration", request, false);
        } else {
            request = { email, password };
            return this._POST_UNAUTHORIZED("/api/v1/users/authenticate", request, false);
        }
    }

    authenticateGoogle(code: string) {
        return this._POST_UNAUTHORIZED("/api/v1/users/google", { code });
    }

    // TODO - Change it to pass token instead of access token
    authenticateFacebook(code: string) {
        return this._POST_UNAUTHORIZED("/api/v1/users/facebook", { code });
    }

    verifyToken(token: string): Promise<void> {
        return this._POST("/api/v1/users/token_verify", { token });
    }

    getCategories(categoryId?: string): Promise<Array<Category>> {
        let url = "/api/v1/marketplace/products/categories";
        if (categoryId) {
            url += `/${categoryId}`;
        }
        return this._GET(url);
    }

    getTags(keyword?: string): Promise<Array<Tag>> {
        let url = "/api/v1/posts/tags";
        if (keyword) {
            url += `?keyword=${keyword}`;
        }
        return this._GET(url);
    }

    getFeatured(type: string): Promise<Array<Featured>> {
        return this._GET(`/api/v1/featured${type}`);
    }

    getRetailers(keyword?: string): Promise<Array<Retailer>> {
        let url = "/api/v1/marketplace/products/merchants";

        if (keyword) {
            url += `?keyword=${keyword}`;
        }
        return this._GET(url);
    }

    getBrands(keyword?: string, nextToken?: string): Promise<Array<Brand>> {
        let url = "/api/v1/marketplace/products/brands";
        if (keyword) {
            url += `?keyword=${keyword}`;
        }
        return this._GET_PAGINATION(url, nextToken);
    }


    // Posts


    getPresignedPost(request: PresignedPostRequest): Promise<void> {
        return this._POST("/api/v1/s3_presigned_post", request);
    }

    updatePost(postId: string, request: PostRequest): Promise<void> {
        return this._PUT(`/api/v1/posts/${postId}`, request);
    }

    createPost(postType: PostType, request: PostRequest | ArticleRequest | ResultRequest): Promise<void> {
        switch (postType) {
            case PostType.ARTICLE:
            case PostType.RESULT:
                return this._POST("/api/v1/featured", request);
            case PostType.BLOG:
            return this._POST("/api/v1/posts", request);
        }
    }

    getLatestPosts(queryString?: string, nextToken?: string): Promise<Post> {
        let url = "/api/v1/posts";
        if (queryString) {
            url += `?${queryString}`;
        }
        return this._GET_PAGINATION(url, nextToken);
    }

    getTrendingPosts(): Promise<Array<PostPreview>> {
        return this._GET("/api/v1/posts/trending");
    }

    getFeedPosts(queryString?: string, nextToken?: string): Promise<Posts> {
        let url = "/api/v1/posts?following_only=true";
        if (queryString) {
            url += `&${queryString}`;
        }
        return this._GET_PAGINATION(url, nextToken);
    }

    getPostTags(postTagType: PostTagType): Promise<void> {
        return this._GET(`/api/v1/posts/tags?type=${postTagType}`);
    }

    getPost(postId: string): Promise<Post> {
        return this._GET(`/api/v1/posts/${postId}`);
    }

    getRelatedPosts(postId: string): Promise<Post> {
        return this._GET(`/api/v1/posts/${postId}/related?page_size=10`);
    }

    getPostsForProduct(productId: string): Promise<Array<PostPreview>> {
        return this._GET(`/api/v1/marketplace/products/${productId}/posts`);
    }


    // Products


    getLatestProducts(queryString?: string, nextToken?: string): Promise<Products> {
        let url = "/api/v1/marketplace/products";
        if (queryString) {
            url += `?${queryString}`;
        }
        return this._GET_PAGINATION(url, nextToken);
    }

    getFeedProducts(queryString?: string, nextToken?: string): Promise<Products> {
        let url = "/api/v1/marketplace/products?following_only=true";
        if (queryString) {
            url += `&${queryString}`;
        }
        return this._GET_PAGINATION(url, nextToken);
    }

    getProduct(productId: string): Promise<any> {
        return this._GET(`/api/v1/marketplace/products/${productId}`);
    }

    getRelatedProducts(productId: string): Promise<any> {
        return this._GET(`/api/v1/marketplace/products/${productId}/related?page_size=10`);
    }


    // Search


    searchProducts(queryString: string): Promise<Array<any>> {
        return this._GET(`/api/v1/products/search${queryString}`);
    }

    searchPosts(queryString?: string): Promise<Array<PostPreview>> {
        let url = "/api/v1/posts/search";
        if (queryString) {
            url += `?keyword=${queryString}`;
        }
        return this._GET(url);
    }

    getFeaturedTrendnines(pageSize?: number): Promise<Array<FeaturedInfluencer>> {
        let url = "/api/v1/influencers";
        if (pageSize) {
            url += `?page_size=${pageSize}`;
        }
        return this._GET(url);
    }

    getTodaysTrendnines(): Promise<Array<Person>> {
        return this._GET("/api/v1/influencers/today?page_size=10");
    }

    getCart(): Promise<any> {
        return this._GET("/api/v1/marketplace/carts");
    }

    getReviews(productId: string): Promise<Array<any>> {
        return this._GET(`/api/v1/marketplace/products/${productId}/reviews`);
    }

    getComments(postId: string): Promise<Array<Comment>> {
        return this._GET(`/api/v1/posts/${postId}/comments`);
    }

    getInfluencer(userId: string): Promise<any> {
        return this._GET(`/api/v1/influencers/${userId}`);
    }

    getPostsForUser(userId: string, queryString?: string, nextToken?: string): Promise<Pagination<PostPreview>> {
        let url = `/api/v1/users/${userId}/posts`;
        if (queryString) {
            url += `?${queryString}`;
        }
        return this._GET_PAGINATION(url, nextToken);
    }

    getWishlist(nextToken?: string): Promise<Array<any>> {
        return this._GET_PAGINATION(`/api/v1/wishlist`, nextToken);
    }

    getProductsForUser(userId: string, queryString?: string, nextToken?: string): Promise<Array<PostPreview>> {
        let url = `/api/v1/users/${userId}/products`;
        if (queryString) {
            url += `?${queryString}`;
        }
        return this._GET_PAGINATION(url, nextToken);
    }

    getUser(): Promise<Person> {
        return this._GET("/api/v1/users");
    }

    updateUser(request: any): Promise<Person> {
        return this._PUT("/api/v1/users", request);
    }

    updatePassword(request: any): Promise<Person> {
        return this._PUT("/api/v1/password", request);
    }

    getUserFollowers(userId: string, nextToken?: string): Promise<Array<Person>> {
        return this._GET_PAGINATION(`/api/v1/users/${userId}/followers`, nextToken);
    }

    getUserFollowing(userId: string): Promise<Array<Person>> {
        return this._GET_PAGINATION(`/api/v1/users/${userId}/followings`);
    }

    followUser(userId: string): Promise<any> {
        return this._PUT(`/api/v1/users/${userId}/follow`);
    }

    unfollowUser(userId: string): Promise<any> {
        return this._DELETE(`/api/v1/users/${userId}/follow`);
    }

    likePost(postId: string): Promise<void> {
        return this._POST(`/api/v1/posts/${postId}/like`);
    }

    unlikePost(postId: string): Promise<void> {
        return this._DELETE(`/api/v1/posts/${postId}/like`);
    }

    likeComment(postId: string, commentId: string): Promise<void> {
        return this._POST(`/api/v1/posts/${postId}/comments/${commentId}/like`);
    }

    unlikeComment(postId: string, commentId: string): Promise<void> {
        return this._DELETE(`/api/v1/posts/${postId}/comments/${commentId}/unlike`);
    }

    submitComment(postId: string, comment: string, parentCommentId?: string): Promise<void> {
        const request = {
            content: comment,
            parent_comment_id: parentCommentId || null,
            is_private: false,
        };

        return this._POST(`/api/v1/posts/${postId}/comments`, request);
    }

    submitReview(productId: string, comment: string, parentCommentId?: string): Promise<any> {
        const request = {
            content: comment,
            rating: 5,
        };

        return this._POST(`/api/v1/marketplace/products/${productId}/reviews`, request);
    }

    subscribe(request): Promise<any> {
        return this._POST(`/api/v1/subscribe`, request);
    }

    applyInfluencer(request): Promise<void> {
        return this._POST(`/api/v1/comingsoon`, request);
    }

    wishlist(postId: string, itemType: string): Promise<void> {
        const request = {
            item_id: postId,
            item_type: itemType,
        };

        return this._PUT(`/api/v1/wishlist`, request);
    }

    unwishlist(postId: string, itemType: string): Promise<void> {
        return this._DELETE(`/api/v1/wishlist/${itemType}/${postId}`);
    }

    wishlistPost(postId: string): Promise<void> {
        return this.wishlist(postId, "blog");
    }

    unwishlistPpost(postId: string): Promise<void> {
        return this.unwishlist(postId, "blog");
    }

    wishlistProduct(productId: string): Promise<void> {
        return this.wishlist(productId, "product");
    }

    unwishlistProduct(productId: string): Promise<void> {
        return this.unwishlist(productId, "product");
    }

    updatePostProductTags(post_id: string, productTags: Array<any>): Promise<void> {
        const request = {
            product_tags: productTags,
        };
        return this._PUT(`/api/v1/posts/product_tags/${post_id}`, request);
    }

    // Tracking

    trackClickFromPost(postId: string, productId: string): Promise<void> {
        return this._POST(`/api/v1/shopnow/products/${productId}?ref_post_id=${postId}`);
    }

    trackClickFromInfluencer(influencerId: string, productId: string): Promise<void> {
        return this._POST(`/api/v1/shopnow/products/${productId}?ref_influencer_id=${influencerId}`);
    }

    getTrackedProductClicks(dateRange: string): Promise<any> {
        return this._GET(`/api/v1/shopnow/products?date_range=${dateRange}`);
    }

    getTrackedClicks(dateRange: string): Promise<ProductClicksResponse> {
        return this._GET(`/api/v1/shopnow?date_range=${dateRange}`);
    }

    private _apiUrl: string;
    private _apiOptions: ApiOptions;

    refreshToken = async () => {
        // Don't refresh token if not expired
        const token = localStorage.getItem("tn_auth_token");
        if (!token) {
            return;
        }
        const exp = JSON.parse(atob(token.split(".")[1]))["exp"];
        const current = (new Date()).getTime() / 1000;
        if (exp > current) {
            return;
        }

        const url = `${this._apiUrl}/api/v1/users/token_refresh`;

        try {
            const token = localStorage.getItem("refresh_token");
            const response = await fetch(url, {
                credentials: "include",
                method: "POST",
                body: JSON.stringify({ refresh: token }),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok || response.status === 204) {
                return null;
            }

            const responseJson = await response.json();

            localStorage.setItem("tn_auth_token", responseJson.access);
            localStorage.setItem("refresh_token", responseJson.refresh);
            return responseJson;
        } catch (err) {
            return null;
        }
    }

    private async _GET(path: string, retry?: boolean): Promise<any> {
        const url = `${this._apiUrl}${path}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: this._getRequestHeader(),
                credentials: "include",
            });

            const responseJson = await response.json();
            if (!response.ok) {
                if (!retry) {
                    await this.refreshToken();
                    return this._GET(path, true);
                }
                const err = await createErrorFromResponse(responseJson);
                this._apiOptions.setError(err);
            }

            if (response.status === 204) {
                return [];
            }

            return responseJson.result;
        } catch (err) {
            this._apiOptions.setError(err);
        }
    }

    private async _GET_PAGINATION(path: string, nextToken?: string, retry?: boolean): Promise<any> {
        let url = `${this._apiUrl}${path}`;
        if (nextToken != null) {
            if (path.indexOf("?") !== -1) {
                url += `&next_token=${nextToken}`;
            } else {
                url += `?next_token=${nextToken}`;
            }
        }

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: this._getRequestHeader(),
                credentials: "include",
            });

            const responseJson = await response.json();
            if (!response.ok) {
                if (!retry) {
                    await this.refreshToken();
                    return this._GET_PAGINATION(path, nextToken, true);
                }
                const err = await createErrorFromResponse(responseJson);
                this._apiOptions.setError(err);
            }

            if (response.status === 204) {
                return [];
            }

            return {
                list: responseJson.result,
                nextToken: responseJson.next_token,
            };
        } catch (err) {
            throw new Error(err);
        }
    }

    private async _POST(path: string, request?: any, retry?: boolean): Promise<any> {
        return this._update(path, "POST", request, retry);
    }

    private async _POST_UNAUTHORIZED(path: string, request?: any, retry?: boolean): Promise<any> {
        return this._update(path, "POST", request, retry, true);
    }

    private async _PUT(path: string, request?: any, retry?: boolean): Promise<any> {
        return this._update(path, "PUT", request, retry);
    }

    private async _DELETE(path: string, request?: any, retry?: boolean): Promise<any> {
        return this._update(path, "DELETE", request, retry);
    }

    private async _update(path: string, method: string, request?: any, retry?: boolean, noAuth?: boolean) {
        const url = `${this._apiUrl}${path}`;

        try {
            const requestObject = request ? Object.assign(request, this._getRequestHeader(noAuth)) : this._getRequestHeader(noAuth);
            const response = await fetch(url, {
                method,
                credentials: "include",
                headers: this._getRequestHeader(noAuth),
                body: JSON.stringify(requestObject),
            });

            const responseJson = await response.json();
            if (!response.ok) {
                if (retry === undefined) {
                    await this.refreshToken();
                    return this._update(path, method, request, true);
                }
                if (retry !== false) {
                    const err = await createErrorFromResponse(responseJson);
                    this._apiOptions.setError(err);
                }
            }
            return responseJson;
        } catch (err) {
            this._apiOptions.setError(err);
        }
    }

    private _getRequestHeader(noAuth?: boolean) {
        const token = localStorage.getItem(tokenName);
        const session = Cookies.getCookie("sessionid");

        let jwtToken = "";

        if (token && token !== "undefined") {
            const exp = JSON.parse(atob(token.split(".")[1]))["exp"];
            const current = (new Date()).getTime() / 1000;
            if (exp > current) {
                jwtToken = `JWT ${token}`;
            }
        }

        if (jwtToken && token && !noAuth) {
            return {
                "Accept": "application/json",
                "Authorization": jwtToken,
                "Content-Type": "application/json",
            };
        }
        return {
            "Accept": "application/json",
            "Content-Type": "application/json",
        };
    }
}
