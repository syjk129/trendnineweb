import * as React from "react";
import { GoogleLogin, GoogleLoginResponseOffline } from "react-google-login";

import FacebookLogin, { FacebookLoginResponse } from "../facebookLogin";
import { AuthData } from "../types";

interface MobileAuthFormProps {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isNewUser: boolean;
    errors: any;
    toggleNewUser(): void;
    onFormChange(data: Partial<AuthData>);
    onSubmit(event: React.FormEvent): void;
    onGoogleSuccess(response: GoogleLoginResponseOffline): void;
    onGoogleFailure(response: GoogleLoginResponseOffline): void;
    onFacebookLogin(response: FacebookLoginResponse): void;
}
