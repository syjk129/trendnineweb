import {
    Category,
    Comment,
    Featured,
    Pagination,
    Person,
    Post,
    PostPreview,
    Posts,
    Products,
    Retailer,
    Tag,
} from "./models";

import {
    createErrorFromResponse,
} from "./errors";

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

    async authenticate(email: string, password: string, firstName?: string, lastName?: string): Promise<void> {
        try {
            let token;
            let request;
            if (firstName && lastName) {
                request = { email, password, first_name: firstName, last_name: lastName, is_blogger: false };
                token = await this._POST("/api/v1/users", request);
            } else {
                request = { email, password, firstName, lastName };
                token = await this._POST("/api/v1/users/authenticate", request);
            }
            localStorage.setItem(tokenName, token.token);
            return token.token;
        } catch (error) {
            throw error;
        }
    }

    async authenticate_google(code: string) {
        const res = await this._POST("/api/v1/users/google", { code });
        localStorage.setItem(tokenName, res.token);
    }

    // TODO - Change it to pass token instead of access token
    async authenticate_facebook(code: string) {
        const res = await this._POST("/api/v1/users/facebook", { code });
        localStorage.setItem(tokenName, res.token);
    }

    verifyToken(token: string): Promise<void> {
        return this._POST("/api/v1/users/token_verify", { token });
    }

    getCategories(categoryId?: string): Promise<Array<Category>> {
        return this._GET(`/api/v1/marketplace/products/categories${categoryId !== null ? "" : "/" + categoryId}`);
    }

    getTags(keyword: string): Promise<Array<Tag>> {
        return this._GET(`/api/v1/posts/tags?keyword=${keyword}`);
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

    getBrands(keyword?: string): Promise<Array<Retailer>> {
        let url = "/api/v1/marketplace/products/brands";

        if (keyword) {
            url += `?keyword=${keyword}`;
        }
        return this._GET(url);
    }

    getLatestPosts(queryString?: string, nextToken?: string): Promise<Post> {
        return this._GET_PAGINATION(`/api/v1/posts?${queryString}`, nextToken);
    }

    getTrendingPosts(): Promise<Array<PostPreview>> {
        return Promise.resolve([]);
        // return this._GET("/api/v1/posts/trending");
    }

    getFeedPosts(queryString?: string, nextToken?: string): Promise<Posts> {
        return this._GET_PAGINATION(`/api/v1/posts?following_only=true&${queryString}`, nextToken);
    }

    getLatestProducts(queryString?: string, nextToken?: string): Promise<Products> {
        return this._GET_PAGINATION(`/api/v1/marketplace/products?${queryString}`, nextToken);
    }

    getFeedProducts(queryString?: string, nextToken?: string): Promise<Products> {
        return this._GET_PAGINATION(`/api/v1/marketplace/products?following_only=true&${queryString}`, nextToken);
    }

    searchPosts(queryString?: string): Promise<Array<PostPreview>> {
        return this._GET(`/api/v1/posts/search?keyword=${queryString}`);
    }

    getPost(postId: string): Promise<Post> {
        return this._GET(`/api/v1/posts/${postId}`);
    }

    getRelatedPosts(postId: string): Promise<Post> {
        return this._GET(`/api/v1/posts/${postId}/related`);
    }

    getProduct(productId: string): Promise<any> {
        return this._GET(`/api/v1/marketplace/products/${productId}`);
    }

    getRelatedProducts(): Promise<any> {
        return this._GET(`/api/v1/marketplace/products/related`);
    }

    getFeaturedTrendnines(): Promise<Array<Person>> {
        return this._GET("/api/v1/influencers");
    }

    getTodaysTrendnines(pageSize?: number): Promise<Array<Person>> {
        let url = "/api/v1/influencers/today";

        if (pageSize) {
            url += `?page_size=${pageSize}`;
        }
        return this._GET(url);
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

    getPostsForUser(userId: string, queryString?: string): Promise<Array<PostPreview>> {
        return this._GET(`/api/v1/users/${userId}/posts?${queryString}`);
    }

    getWishlist(): Promise<Array<any>> {
        return this._GET(`/api/v1/wishlist`);
    }

    getProductsForUser(userId: string, queryString?: string): Promise<Array<PostPreview>> {
        return this._GET(`/api/v1/users/${userId}/products?${queryString}`);
    }

    getUser(): Promise<Person> {
        return this._GET("/api/v1/users");
    }

    getUserFollowers(userId: string): Promise<Array<Person>> {
        return this._GET(`/api/v1/users/${userId}/followers`);
    }

    getUserFollowing(userId: string): Promise<Array<Person>> {
        return this._GET(`/api/v1/users/${userId}/followings`);
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

    submitReview(productId: string, comment: string, parentCommentId?: string): Promise<void> {
        const request = {
            content: comment,
            rating: 5,
        };

        return this._POST(`/api/v1/marketplace/products/${productId}/reviews`, request);
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

    private _apiUrl: string;
    private _apiOptions: ApiOptions;

    private async _GET(path: string): Promise<any> {
        const url = `${this._apiUrl}${path}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: this._getRequestHeader(),
            });

            if (!response.ok) {
                console.warn("not ok");
            }

            if (response.status === 204) {
                return [];
            }

            const responseJson = await response.json();
            return responseJson.result;
        } catch (err) {
            this._apiOptions.setError(err);
        }
    }

    private async _GET_PAGINATION(path: string, nextToken: string): Promise<any> {
        let url = `${this._apiUrl}${path}`;
        if (nextToken != null) {
            url += `&next_token=${nextToken}`;
        }

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: this._getRequestHeader(),
            });

            if (!response.ok) {
                console.warn("not ok");
            }

            if (response.status === 204) {
                return [];
            }

            const responseJson = await response.json();
            return {
                list: responseJson.result,
                nextToken: responseJson.next_token,
            };
        } catch (err) {
            throw new Error(err);
        }
    }

    private async _POST(path: string, request?: any): Promise<any> {
        return this._update(path, "POST", request);
    }

    private async _PUT(path: string, request?: any): Promise<any> {
        return this._update(path, "PUT", request);
    }

    private async _DELETE(path: string, request?: any): Promise<any> {
        return this._update(path, "DELETE", request);
    }

    private async _update(path: string, method: string, request?: any) {
        const url = `${this._apiUrl}${path}`;

        try {
            const requestObject = request ? Object.assign(request, this._getRequestHeader()) : this._getRequestHeader();
            const response = await fetch(url, {
                method: method,
                headers: this._getRequestHeader(),
                body: JSON.stringify(requestObject),
            });
            if (!response.ok) {
                this._apiOptions.setError(createErrorFromResponse(response));
            }

            const responseJson = await response.json();
            return responseJson;
        } catch (err) {
            this._apiOptions.setError(err);
        }
    }

    private _getRequestHeader() {
        const token = localStorage.getItem(tokenName);

        return {
            "Accept": "application/json",
            "Authorization": (token && token !== "undefined") ? `JWT ${token}` : "",
            "Content-Type": "application/json",
        };
    }
}
