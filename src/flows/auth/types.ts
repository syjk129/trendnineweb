export interface AuthFormDataProps {
    email: string;
    password: string;
}

export type AuthFormData = AuthFormDataProps;

export interface AuthDataProps extends AuthFormDataProps {
    isNewUser: boolean;
}

export type AuthData = AuthDataProps;

export interface AuthFormProps extends AuthData {
    onSubmit(event: any): void;
    onFormChange(data: Partial<AuthData>): void;
}

export class FacebookLoginResponse {
    code: string;
    error?: string;
}
