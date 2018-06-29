export class NetworkError extends Error {
    readonly name = "NetworkError";
    readonly isNetworkError = true;

    readonly error: Error;

    constructor(err: Error) {
        super(err.message);

        this.error = err;
    }
}

export class AuthError extends Error {
    // readonly name = "AuthError";
    readonly isAuthError = true;

    readonly error: Error;

    constructor(err: Error) {
        super(err.message);

        this.error = err;
    }
}

export function isAuthError(error: any): error is AuthError {
    return error.isAuthError;
}

export async function createErrorFromResponse(responseJson: any) {
    const errorKey = Object.keys(responseJson);
    const message = responseJson.result ? responseJson.result[errorKey][0] : responseJson[errorKey][0];

    if (responseJson.status === 401) {
        return new AuthError(new Error(message || responseJson.statusText));
    }

    return new NetworkError(new Error(message || responseJson.statusText));
}
