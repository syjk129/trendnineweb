import {
    Category,
    Comment,
    Pagination,
    Person,
    Post,
    Posts,
    PostPreview,
    Retailer,
    Tag,
} from "./models";

export interface ApiOptions {
    apiUrl: string;
}

const tokenName = "tn_auth_token";

export default class Api {
    constructor(options: ApiOptions) {
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

    verifyToken(token: string): Promise<void> {
        return this._POST("/api/v1/users/token_verify", { token });
    }

    getCategories(categoryId?: string): Promise<Array<Category>> {
        return this._GET(`/api/v1/marketplace/products/categories${categoryId !== null ? "" : "/" + categoryId}`);
    }

    getTags(keyword: string): Promise<Array<Tag>> {
        return this._GET(`/api/v1/posts/tags?keyword=${keyword}`);
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

    getLatestPosts(queryString?: string, next_token: string): Promise<Posts> {
        return this._GET_PAGINATION(`/api/v1/posts?${queryString}`, next_token);
    }

    getTrendingPosts(): Promise<Array<PostPreview>> {
        return this._GET("/api/v1/posts/trending");
    }

    getFeedPosts(next_token: string): Promise<Posts> {
        return this._GET_PAGINATION("/api/v1/posts?following_only=true", next_token);
    }

    searchPosts(queryString?: string): Promise<Array<PostPreview>> {
        return this._GET(`/api/v1/posts/search?keyword=${queryString}`);
    }

    getPost(postId: string): Promise<Post> {
        return this._GET(`/api/v1/posts/${postId}`);
    }

    getRelatedPosts(): Promise<Post> {
        return this._GET(`/api/v1/posts/related`);
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

    getPostsForUser(userId: string): Promise<Array<PostPreview>> {
        return this._GET(`/api/v1/users/${userId}/posts`);
    }

    getWishlist(): Promise<Array<any>> {
        return this._GET(`/api/v1/wishlist`);
    }

    getProductsForUser(userId: string): Promise<Array<PostPreview>> {
        return this._GET(`/api/v1/users/${userId}/products`);
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

    toggleWishlist(id: string, type: string): Promise<void> {
        const request = {
            item_id: id,
            item_type: type,
        };

        return this._PUT(`/api/v1/wishlist`, request);
    }

    private _apiUrl: string;

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
            throw new Error(err);
        }
    }

    private async _GET_PAGINATION(path: string, next_token: string): Promise<any> {
        const url = `${this._apiUrl}${path}`;

        if (next_token != null) {
            url += `&next_token=${next_token}`
        }

        console.log(url)

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
                next_token: responseJson.next_token,
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
                console.warn("not ok");
            }

            const responseJson = await response.json();
            return responseJson;
        } catch (err) {
            throw new Error(err);
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
