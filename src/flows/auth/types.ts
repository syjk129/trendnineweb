export interface AuthDataProps {
    username: string;
    password: string;
}

export type AuthData = AuthDataProps;

export interface RegisterDataProps extends AuthData {
    firstName: string;
    lastName: string;
}

export type RegisterData = RegisterDataProps;

export interface AuthFormProps extends AuthData {
    onSubmit(event: any): void;
    onFormChange(data: Partial<AuthData | RegisterData>): void;
}
