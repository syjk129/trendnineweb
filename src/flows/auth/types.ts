export interface AuthFormDataProps {
    email: string;
    password: string;
}

export type AuthFormData = AuthFormDataProps;

export interface RegisterFormDataProps extends AuthFormDataProps {
    firstName: string;
    lastName: string;
}

export type RegisterFormData = RegisterFormDataProps;

export interface AuthDataProps extends RegisterFormData {
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
