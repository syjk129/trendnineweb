import * as React from "react";
import { isMobile } from "react-device-detect";
import { GoogleLogin, GoogleLoginResponseOffline } from "react-google-login";

import Button, { LinkButton } from "../../../components/button";
import Input, { InputType } from "../../../components/input";
import RouteProps from "../../routeProps";
import FacebookLogin from "../facebookLogin";
import { AuthData, FacebookLoginResponse } from "../types";

import "./style.scss";

interface AuthFormProps extends RouteProps {
    errors: any;
    authenticate(data: AuthData): void;
    authenticateFacebook(response: FacebookLoginResponse): Promise<void>;
    authenticateGoogle(response: GoogleLoginResponseOffline): Promise<void>;
    clearErrors(): void;
}

type AuthFormState = AuthData;

export default class AuthForm extends React.Component<AuthFormProps, AuthFormState> {
    state: AuthFormState = {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        isNewUser: true,
    };

    render() {
        let classes = "auth-form";
        if (isMobile) {
            classes += ` mobile`;
        }

        return (
            <div className={classes}>
                <form onSubmit={this._onSubmit}>
                    {this.state.isNewUser ? (
                        <>
                            <p className="form-name">Join TrendNine</p>
                            <p className="registration-description">Create an account to personalize your shopping experience, follow your favorite influencers, like and wishlist outfits you love, and more.</p>
                        </>
                    ) : (
                        <p className="form-name">Welcome Back</p>
                    )}
                    <GoogleLogin
                        className="google-login button button-primary"
                        clientId="174930742509-kvp3mkdgdb5c8staoesefgltj377tgsq.apps.googleusercontent.com"
                        responseType="code"
                        buttonText={this.state.isNewUser ? "Sign up with Google" : "Sign in with Google"}
                        onSuccess={this._onGoogleSuccess}
                        onFailure={this._onGoogleFailure}
                    />
                    <FacebookLogin
                        appId="201224070695370"
                        sdkVersion="v3.0"
                        fields="name,email,picture"
                        responseType="code"
                        buttonText={this.state.isNewUser ? "Sign up with Facebook" : "Sign in with Facebook"}
                        onCallback={this._onFacebookLogin}
                    />
                    <div className="divider" />
                    {this.state.isNewUser ? (
                        <>
                            <div className="grouped-input">
                                <div>
                                    <Input
                                        className="auth-input"
                                        placeholder="First Name"
                                        value={this.state.firstName}
                                        onChange={(firstName) => this._handleFormChange({ firstName })}
                                    />
                                    {this.props.errors && this.props.errors["first_name"] && (
                                        <div className="input-error">
                                            {this.props.errors["first_name"]}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        className="auth-input"
                                        placeholder="Last Name"
                                        value={this.state.lastName}
                                        onChange={(lastName) => this._handleFormChange({ lastName })}
                                    />
                                    {this.props.errors && this.props.errors["last_name"] && (
                                        <div className="input-error">
                                            {this.props.errors["last_name"]}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Input
                                className="auth-input"
                                placeholder="Email Address"
                                value={this.state.email}
                                onChange={(email) => this._handleFormChange({ email })}
                            />
                            {this.props.errors && this.props.errors["email"] && (
                                <div className="input-error">
                                    {this.props.errors["email"]}
                                </div>
                            )}
                            <Input
                                className="auth-input"
                                placeholder="Password"
                                type={InputType.PASSWORD}
                                value={this.state.password}
                                onChange={(password) => this._handleFormChange({ password })}
                            />
                            {this.props.errors && this.props.errors["password"] && (
                                <div className="input-error">
                                    {this.props.errors["password"]}
                                </div>
                            )}
                            <p className="signup-disclaimer">By signing up, you agree to TrendNine's <a href="/terms">Terms of Service</a> & <a href="/privacy">Privacy Policy</a></p>
                            <input type="submit" style={{ display: "none" }} />
                            <Button className="submit-button" rounded onClick={this._onSubmit}>Sign up</Button>
                            <p className="switch">Already on TrendNine?&nbsp;<LinkButton onClick={this._toggleNewUser}>Sign in</LinkButton></p>
                        </>
                    ) : (
                        <>
                            <Input
                                className="auth-input"
                                placeholder="Email Address"
                                value={this.state.email}
                                onChange={(email) => this._handleFormChange({ email })}
                            />
                            {this.props.errors && this.props.errors["email"] && (
                                <div className="input-error">
                                    {this.props.errors["email"]}
                                </div>
                            )}
                            <Input
                                className="auth-input"
                                placeholder="Password"
                                type={InputType.PASSWORD}
                                value={this.state.password}
                                onChange={(password) => this._handleFormChange({ password })}
                            />
                            {this.props.errors && this.props.errors["password"] && (
                                <div className="input-error">
                                    {this.props.errors["password"]}
                                </div>
                            )}
                            <input type="submit" style={{ display: "none" }} />
                            <Button className="submit-button" rounded onClick={this._onSubmit}>Sign in</Button>
                            <p className="switch">Don't have an account?&nbsp;<LinkButton onClick={this._toggleNewUser}>Sign up</LinkButton></p>
                        </>
                    )}
                </form>
            </div>
        );
    }

    private _toggleNewUser = () => {
        this.props.clearErrors();
        this.setState({ isNewUser: !this.state.isNewUser });
    }

    private _onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await this.props.authenticate(this.state);
        return false;
    }


    private _handleFormChange = (data: Partial<AuthData>) => {
        this.setState({
            email: data.email !== undefined ? data.email : this.state.email,
            password: data.password !== undefined ? data.password : this.state.password,
            firstName: data.firstName !== undefined ? data.firstName : this.state.firstName,
            lastName: data.lastName !== undefined ? data.lastName : this.state.lastName,
        });
    }

    private _onGoogleSuccess = (response: GoogleLoginResponseOffline) => {
        this.props.authenticateGoogle(response);
    }

    private _onGoogleFailure = (response: GoogleLoginResponseOffline) => {
    }

    private _onFacebookLogin = (response: FacebookLoginResponse) => {
        if (!response.error) {
            this.props.authenticateFacebook(response);
        }
    }
}
