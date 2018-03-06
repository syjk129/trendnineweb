import {
    Comment,
    Person,
    Post,
    PostPreview,
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

    getLatestPosts(): Promise<Array<PostPreview>> {
        return this._GET("/api/v1/posts");
    }

    getPost(postId: string): Promise<Post> {
        return this._GET(`/api/v1/posts/${postId}`);
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

    submitComment(postId: string, comment: string): Promise<void> {
        const request = {
            content: comment,
            parent_comment_id: null,
            is_private: false,
        };

        return this._POST(`/api/v1/posts/${postId}/comments`, request);
    }

    toggleWishlist(id: string, type: string): Promise<void> {
        return this._PUT(`/api/v1/wishlist`, { item_id: id, item_type: type });
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

    private async _POST(path: string, request: any): Promise<any> {
        return this._update(path, request, "POST");
    }

    private async _PUT(path: string, request: any): Promise<any> {
        return this._update(path, request, "PUT");
    }

    private async _update(path: string, request: any, method: string) {
        const url = `${this._apiUrl}${path}`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: this._getRequestHeader(),
                body: JSON.stringify(Object.assign(request, this._getRequestHeader())),
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
