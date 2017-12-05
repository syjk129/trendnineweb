import { Post } from "./models";

export interface ApiOptions {
    apiUrl: string;
    token: string;
}

export default class Api {
    constructor(options: ApiOptions) {
        this._apiUrl = options.apiUrl;
    }

    async authenticate(email: string, password: string): Promise<void> {
        const request = { email, password };
        const token = await this._POST(`${this._apiUrl}/api/v1/users/authenticate`, request);
        window.sessionStorage.setItem("token", token);
    }

    getLatestPosts(): Promise<Array<Post>> {
        return this._GET(`${this._apiUrl}/api/v1/posts`);
    }

    private _apiUrl: string;

    private async _GET(url: string): Promise<any> {
        const headers = new Headers();
        headers.append("Content-Type", "text/plain");

        try {
            const response = await fetch(url, {
                method: "GET",
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

    private async _POST(url: string, request: any): Promise<any> {
        const headers = new Headers();
        headers.append("Content-Type", "text/plain");

        try {
            const response = await fetch(url, {
                method: "POST",
                ...request,
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
}
