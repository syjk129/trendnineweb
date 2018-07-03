import {
    Brand,
    Category,
    Comment,
    Featured,
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

    authenticate(email: string, password: string, isNewUser: boolean, firstName?: string, lastName?: string): Promise<void> {
        let request;
        if (isNewUser) {
            request = { email, password, first_name: firstName, last_name: lastName };
            return this._POST("/api/v1/users/registration", request);
        } else {
            request = { email, password };
            return this._POST("/api/v1/users/authenticate", request);
        }
    }

    authenticateGoogle(code: string) {
        return this._POST("/api/v1/users/google", { code });
    }

    // TODO - Change it to pass token instead of access token
    authenticateFacebook(code: string) {
        return this._POST("/api/v1/users/facebook", { code });
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

    getBrands(keyword?: string, nextToken?: string): Promise<Array<Brand>> {
        let url = "/api/v1/marketplace/products/brands?";
        if (keyword) {
            url = `${url}keyword=${keyword}`;
        }
        return this._GET_PAGINATION(url, nextToken);
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

    searchPosts(queryString?: string): Promise<Array<PostPreview>> {
        let url = "/api/v1/posts/search";
        if (queryString) {
            url += `?keyword=${queryString}`;
        }
        return this._GET(url);
    }

    getPost(postId: string): Promise<Post> {
        return this._GET(`/api/v1/posts/${postId}`);
    }

    getRelatedPosts(postId: string): Promise<Post> {
        return this._GET(`/api/v1/posts/${postId}/related?page_size=5`);
    }

    getProduct(productId: string): Promise<any> {
        return this._GET(`/api/v1/marketplace/products/${productId}`);
    }

    getRelatedProducts(): Promise<any> {
        return this._GET(`/api/v1/marketplace/products/related?page_size=10`);
    }

    getPostsForProduct(productId: string): Promise<Array<PostPreview>> {
        return this._GET(`/api/v1/marketplace/products/${productId}/posts`);
    }

    getFeaturedTrendnines(pageSize?: number): Promise<Array<Person>> {
        let url = "/api/v1/influencers";
        if (pageSize) {
            url += `?page_size=${pageSize}`;
        }
        return this._GET(url);
    }

    getTodaysTrendnines(): Promise<Array<Person>> {
        return this._GET("/api/v1/influencers/today");
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
        let url = `/api/v1/users/${userId}/posts`;
        if (queryString) {
            url += `?${queryString}`;
        }
        return this._GET(url);
    }

    getWishlist(): Promise<Array<any>> {
        return this._GET(`/api/v1/wishlist`);
    }

    getProductsForUser(userId: string, queryString?: string): Promise<Array<PostPreview>> {
        let url = `/api/v1/users/${userId}/products`;
        if (queryString) {
            url += `?${queryString}`;
        }
        return this._GET(url);
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

    subscribe(request): Promise<void> {
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

    private _apiUrl: string;
    private _apiOptions: ApiOptions;

    private async _GET(path: string): Promise<any> {
        const url = `${this._apiUrl}${path}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: this._getRequestHeader(),
            });

            const responseJson = await response.json();
            if (!response.ok) {
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

    private async _GET_PAGINATION(path: string, nextToken: string): Promise<any> {
        let url = `${this._apiUrl}${path}`;
        if (nextToken != null) {
            url += `?next_token=${nextToken}`;
        }

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: this._getRequestHeader(),
                mode: "cors",
            });

            const responseJson = await response.json();
            if (!response.ok) {
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
                method,
                headers: this._getRequestHeader(),
                body: JSON.stringify(requestObject),
                mode: "cors",
            });

            const responseJson = await response.json();
            if (!response.ok) {
                const err = await createErrorFromResponse(responseJson);
                this._apiOptions.setError(err);
            }

            return responseJson;
        } catch (err) {
            this._apiOptions.setError(err);
        }
    }

    private _getRequestHeader() {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem(tokenName);
        let jwtToken = "";

        if (token && token !== "undefined") {
            const exp = JSON.parse(atob(token.split(".")[1]))["exp"];
            const current = (new Date()).getTime() / 1000;
            if (exp > current) {
                jwtToken = `JWT ${token}`;
            }
        }

        return {
            "Accept": "application/json",
            // "Access-Control-Allow-Origin": "*",
            "Authorization": jwtToken,
            "Content-Type": "application/json",
        };
    }
}
