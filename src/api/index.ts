import { Person, Post } from "./models";

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

    getLatestPosts(): Promise<Array<Post>> {
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

            const responseJson = await response.json();
            return responseJson;
        } catch (err) {
            throw new Error(err);
        }
    }

    private async _POST(path: string, request: any): Promise<any> {
        const url = `${this._apiUrl}${path}`;

        try {
            const response = await fetch(url, {
                method: "POST",
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
