import * as React from "react";
import { GoogleLogin, GoogleLoginResponseOffline } from "react-google-login";

import Button, { LinkButton } from "../../../components/button";
import Input, { InputType, InputVariant } from "../../../components/input";
import FacebookLogin, { FacebookLoginResponse } from "../facebookLogin";
import { AuthFormData } from "../types";

interface DesktopAuthFormProps {
    email: string;
    password: string;
    isNewUser: boolean;
    toggleNewUser(): void;
    onFormChange(data: Partial<AuthFormData>);
    onSubmit(): void;
    onGoogleSuccess(response: GoogleLoginResponseOffline): void;
    onGoogleFailure(response: GoogleLoginResponseOffline): void;
    onFacebookLogin(response: FacebookLoginResponse): void;
}

export default function DesktopAuthForm({
    email,
    password,
    isNewUser,
    toggleNewUser,
    onFormChange,
    onSubmit,
    onGoogleSuccess,
    onGoogleFailure,
    onFacebookLogin,
}: DesktopAuthFormProps) {
    return (
        <div className="auth-form">
            {isNewUser ? (
                <form onSubmit={onSubmit}>
                    <p className="form-name">Join TrendNine</p>
                    <Input
                        placeholder="Email Address"
                        value={email}
                        variant={InputVariant.UNDERLINE}
                        onChange={(email) => onFormChange({ email })}
                    />
                    <Input
                        placeholder="Password"
                        type={InputType.PASSWORD}
                        variant={InputVariant.UNDERLINE}
                        value={password}
                        onChange={(password) => onFormChange({ password })}
                    />
                    <p className="signup-disclaimer">By signing up, you agree to TrendNine's Terms of Service & Privacy Policy</p>
                    <Button onClick={onSubmit}>Sign up</Button>
                    <LinkButton onClick={toggleNewUser}>Sign in</LinkButton>
                </form>
            ) : (
                <form onSubmit={onSubmit}>
                    <p className="form-name">Welcome back</p>
                    <Input
                        placeholder="Email Address"
                        value={email}
                        variant={InputVariant.UNDERLINE}
                        onChange={(email) => onFormChange({ email })}
                    />
                    <Input
                        placeholder="Password"
                        type={InputType.PASSWORD}
                        variant={InputVariant.UNDERLINE}
                        value={password}
                        onChange={(password) => onFormChange({ password })}
                    />
                    <Button onClick={onSubmit}>Sign in</Button>
                    <LinkButton onClick={toggleNewUser}>Sign in</LinkButton>
                </form>
            )}
            <GoogleLogin
                className="google-login"
                clientId="174930742509-kvp3mkdgdb5c8staoesefgltj377tgsq.apps.googleusercontent.com"
                responseType="code"
                onSuccess={onGoogleSuccess}
                onFailure={onGoogleFailure}
            />
            <FacebookLogin
                appId="201224070695370"
                sdkVersion="v3.0"
                fields="name,email,picture"
                responseType="code"
                onCallback={onFacebookLogin}
            />
        </div>
    );
}
