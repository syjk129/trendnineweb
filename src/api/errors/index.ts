export class NetworkError extends Error {
    readonly name = "NetworkError";
    readonly isNetworkError = true;

    readonly error: Error;

    constructor(err: Error) {
        super(`NetworkError: ${err}`);

        this.error = err;
    }
}

export class AuthError extends NetworkError {
    // readonly name = "AuthError";
    readonly isAuthError = true;

    readonly error: Error;

    constructor(err: Error) {
        super(err);

        this.error = err;
    }
}

export function createErrorFromResponse(response: Response) {
    if (response.status === 401) {
        return new AuthError(new Error(response.statusText));
    }

    return new NetworkError(new Error(response.statusText));
}
