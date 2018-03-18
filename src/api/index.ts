import {
    Comment,
    Person,
    Post,
    PostPreview,
    Tag,
    Retailer,
    Category,
} from "./models";

export interface ApiOptions {
    apiUrl: string;
}

const tokenName = "tn_auth_token";

export default class Api {
    constructor(options: ApiOptions) {
        this._apiUrl = options.apiUrl;
    }

    async authenticate(email: string, password: string): Promise<void> {
        const request = { email, password };
        try {
            const token = await this._POST("/api/v1/users/authenticate", request);
            localStorage.setItem(tokenName, token.token);
        } catch (error) {
            throw error;
        }
    }

    getCategories(categoryId?: string): Promise<Array<Category>> {
        return this._GET(`/api/v1/marketplace/products/categories${categoryId !== null ? "" : "/" + categoryId}`);
    }

    getTags(keyword: string): Promise<Array<Tag>> {
        return this._GET(`/api/v1/posts/tags?keyword=${keyword}`);
    }

    getRetailers(keyword: string): Promise<Array<Retailer>> {
        return this._GET(`/api/v1/posts/merchants?keyword=${keyword}`);
    }

    getLatestPosts(): Promise<Array<PostPreview>> {
        return this._GET("/api/v1/posts");
    }

    getPost(postId: string): Promise<Post> {
        return this._GET(`/api/v1/posts/${postId}`);
    }

    getRelatedPosts(): Promise<Post> {
        return this._GET(`/api/v1/posts/related`);
    }

    getRelatedProducts(): Promise<any> {
        return this._GET(`/api/v1/marketplace/products/related`);
    }

    getFeaturedTrendnines(): Promise<Array<Person>> {
        return this._GET("/api/v1/influencers");
    }

    getCart(): Promise<any> {
        return this._GET("/api/v1/marketplace/carts");
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

    getProductsForUser(userId: string): Promise<Array<PostPreview>> {
        return this._GET(`/api/v1/users/${userId}/products`);
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
            "Authorization": token ? `JWT ${token}` : "",
            "Content-Type": "application/json",
        };
    }
}
