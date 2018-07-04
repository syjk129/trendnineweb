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
    if (responseJson.status === 401 ||
        responseJson.result === "Unauthorized" ||
        responseJson.result.indexOf("Permission denied") !== -1
    ) {
        return new AuthError(new Error(responseJson.statusText));
    }

    return new NetworkError(new Error(responseJson.statusText));
}
