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

export class PermissionError extends Error {
    readonly isPermissionError = true;

    readonly error: Error;

    constructor(err: Error) {
        super(err.message);

        this.error = err;
    }
}

export function isPermissionError(error: any): error is PermissionError {
    return error.isPermissionError;
}

export class CorruptedUserError extends Error {
    readonly isCorruptedUserError = true;

    readonly error: Error;

    constructor(err: Error) {
        super(err.message);

        this.error = err;
    }
}

export function isCorruptedUserError(error: any): error is CorruptedUserError {
    return error.isCorruptedUserError;
}

export async function createErrorFromResponse(responseJson: any) {
    if (responseJson.status === 401 ||
        (responseJson.result && responseJson.result === "Unauthorized")
    ) {
        return new AuthError(new Error(responseJson.statusText));
    }
    if (responseJson.code === "user_not_found" || responseJson.result.user_id_or_username) {
        return new CorruptedUserError(new Error(responseJson.statusText));
    }
    if (responseJson.result && responseJson.result.indexOf("Permission denied") !== -1) {
        return new PermissionError(new Error(responseJson.statusText));
    }

    return new NetworkError(new Error(responseJson.statusText));
}
