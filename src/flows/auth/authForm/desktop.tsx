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
    onSubmit(event: React.FormEvent): void;
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
        <div className="desktop-auth-form">
            <form onSubmit={onSubmit}>
                {isNewUser ? (
                    <>
                        <p className="form-name">Join TrendNine</p>
                        <p className="registration-description">Create an account to personalize your shopping experience, follow your favorite influencers, like and wishlist outfits you love, and more.</p>
                    </>
                ) : (
                    <p className="form-name">Welcome back</p>
                )}
                <GoogleLogin
                    className="google-login button button-primary"
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
                <div className="divider" />
                {isNewUser ? (
                    <>
                        <Input
                            className="auth-input"
                            placeholder="Email Address"
                            value={email}
                            onChange={(email) => onFormChange({ email })}
                        />
                        <Input
                            className="auth-input"
                            placeholder="Password"
                            type={InputType.PASSWORD}
                            value={password}
                            onChange={(password) => onFormChange({ password })}
                        />
                        <p className="signup-disclaimer">By signing up, you agree to TrendNine's Terms of Service & Privacy Policy</p>
                        <input type="submit" style={{ display: "none" }} />
                        <Button className="submit-button" rounded onClick={onSubmit}>Sign up</Button>
                        <p className="switch">Already on TrendNine?&nbsp;<LinkButton onClick={toggleNewUser}>Sign in</LinkButton></p>
                    </>
                ) : (
                    <>
                        <Input
                            className="auth-input"
                            placeholder="Email Address"
                            value={email}
                            onChange={(email) => onFormChange({ email })}
                        />
                        <Input
                            className="auth-input"
                            placeholder="Password"
                            type={InputType.PASSWORD}
                            value={password}
                            onChange={(password) => onFormChange({ password })}
                        />
                        <input type="submit" style={{ display: "none" }} />
                        <Button className="submit-button" rounded onClick={onSubmit}>Sign in</Button>
                        <p className="switch">Don't have an account?&nbsp;<LinkButton onClick={toggleNewUser}>Sign up</LinkButton></p>
                    </>
                )}
            </form>
        </div>
    );
}
