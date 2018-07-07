import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { GoogleLogin, GoogleLoginResponseOffline } from "react-google-login";
import { withRouter } from "react-router-dom";

import { Person } from "../../api/models";
import { AppContext } from "../../app";
import Button, { ButtonVariant, LinkButton } from "../../components/button";
import Input, { InputType, InputVariant } from "../../components/input";
import FacebookLogin, { FacebookLoginResponse } from "../auth/facebookLogin";
import { AuthFormDataProps } from "../auth/types";
import RouteProps from "../routeProps";

import "./style.scss";

type SettingsProps = RouteProps;

interface SettingsState extends AuthFormDataProps {
    username: string;
    usernameErrorMsg: string;
    first_name: string;
    last_name: string;
    profile_image_url: string;
    is_facebook_linked: boolean;
    is_google_linked: boolean;
    is_instagram_linked: boolean;
    showPasswordChange: boolean;
    password: string;
    passwordErrorMsg: string;
    old_password: string;
    oldPasswordErrorMsg: string;
    confirm_password: string;
    confirmPasswordErrorMsg: string;
}

class Settings extends React.Component<SettingsProps, SettingsState> {
    static contextTypes: AppContext;

    state: SettingsState = {
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        usernameErrorMsg: "",
        profile_image_url: "https://www.trendnine.com/profile.png",
        is_facebook_linked: false,
        is_google_linked: false,
        is_instagram_linked: false,
        showPasswordChange: false,
        password: "",
        passwordErrorMsg: "",
        old_password: "",
        oldPasswordErrorMsg: "",
        confirm_password: "",
        confirmPasswordErrorMsg: "",
    };

    componentWillMount() {
        this._getUserData();
    }

    render() {
        const rawUser = localStorage.getItem("user");
        let user: Person;
        if (rawUser && rawUser !== "undefined") {
            user = JSON.parse(rawUser);
        } else {
            return null;
        }
        const className = isMobile ? "settings-auth-form mobile-auth-form" : "settings-auth-form";

        return (
            <div className={className}>
                {!this.state.showPasswordChange && (
                    <form onSubmit={this._onSubmit}>
                        {/* <div>
                            <p>Your Profile Photo</p>
                            <Input
                                placeholder="Profile Image"
                                variant={InputVariant.OUTLINE}
                                type={InputType.FILE}
                                onChange={(username) => this._handleFormChange({ username })}
                            />
                        </div> */}
                        <div className="input-container">
                            <div className="name-container">
                                <div className="short-input-container">
                                    <p>First Name</p>
                                    <Input
                                        placeholder=""
                                        value={this.state.first_name}
                                        variant={InputVariant.OUTLINE}
                                        onChange={(first_name) => this._handleFormChange({ first_name })}
                                        required={true}
                                    />
                                </div>
                                <div className="short-input-container">
                                    <p>Last Name</p>
                                    <Input
                                        placeholder=""
                                        value={this.state.last_name}
                                        variant={InputVariant.OUTLINE}
                                        onChange={(last_name) => this._handleFormChange({ last_name })}
                                        required={true}
                                    />
                                </div>
                            </div>
                            <div className="short-input-container">
                                <div>
                                    <div className="input-header">
                                        <div className="input-label">Username</div> {this.state.usernameErrorMsg && (
                                        <div className="error-msg">{this.state.usernameErrorMsg}</div>)}
                                    </div>
                                    <Input
                                        placeholder=""
                                        value={this.state.username}
                                        variant={InputVariant.OUTLINE}
                                        onChange={(username) => this._handleFormChange({ username })}
                                        required={true}
                                    />
                                </div>
                            </div>
                            <div>
                                <p>Email</p>
                                <Input
                                    placeholder=""
                                    value={this.state.email}
                                    type={InputType.EMAIL}
                                    variant={InputVariant.OUTLINE}
                                    onChange={(email) => this._handleFormChange({ email })}
                                    required={true}
                                />
                            </div>
                        </div>
                        {/* <div className="input-container">
                            <GoogleLogin
                                className="google-login button"
                                clientId="174930742509-kvp3mkdgdb5c8staoesefgltj377tgsq.apps.googleusercontent.com"
                                responseType="code"
                                buttonText={this.state.is_google_linked ? "Linked Google" : "Link Google"}
                                onSuccess={this._authenticateGoogle}
                                onFailure={this._onGoogleFailure}
                                disabled={this.state.is_google_linked}
                            />
                            <FacebookLogin
                                appId="201224070695370"
                                sdkVersion="v3.0"
                                fields="name,email,picture"
                                buttonText={this.state.is_facebook_linked ? "Linked Facebook" : "Link Facebook"}
                                responseType="code"
                                onCallback={this._authenticateFacebook}
                                disabled = {this.state.is_facebook_linked}
                            />
                        </div> */}
                        <div className="link-buttons-container">
                            <LinkButton onClick={() => this.setState({showPasswordChange: true})}>Change Password</LinkButton>
                            <LinkButton onClick={() => this.props.history.push("/logout")}>Sign out</LinkButton>
                        </div>
                        <div className="link-buttons-container">
                            <input type="submit" style={{ display: "none" }} />
                            <Button className="save-changes" rounded onClick={this._onSubmit}>Save Changes</Button>
                            <Button rounded onClick={this._getUserData} variant={ButtonVariant.OUTLINE}>Cancel</Button>
                        </div>
                    </form>
                )}
                {this.state.showPasswordChange && (
                    <form onSubmit={this._onPasswordChange}>
                        <div className="input-container">
                            <div>
                                <div className="input-header">
                                    <div className="input-label">Current Password</div> {this.state.oldPasswordErrorMsg && (
                                    <div className="error-msg">{this.state.oldPasswordErrorMsg}</div>)}
                                </div>
                                <Input
                                    placeholder=""
                                    value={this.state.old_password}
                                    type={InputType.PASSWORD}
                                    variant={InputVariant.OUTLINE}
                                    onChange={(old_password) => this._handleFormChange({ old_password })}
                                    required={true}
                                />
                            </div>
                            <div>
                                <div className="input-header">
                                    <div className="input-label">New Password</div> {this.state.passwordErrorMsg && (
                                    <div className="error-msg">{this.state.passwordErrorMsg}</div>)}
                                </div>
                                <Input
                                    placeholder=""
                                    value={this.state.password}
                                    type={InputType.PASSWORD}
                                    variant={InputVariant.OUTLINE}
                                    onChange={(password) => this._handleFormChange({ password })}
                                    required={true}
                                />
                            </div>
                            <div>
                                <div className="input-header">
                                    <div className="input-label">Confirm Password</div> {this.state.confirmPasswordErrorMsg && (
                                    <div className="error-msg">{this.state.confirmPasswordErrorMsg}</div>)}
                                </div>
                                <Input
                                    placeholder=""
                                    value={this.state.confirm_password}
                                    type={InputType.PASSWORD}
                                    variant={InputVariant.OUTLINE}
                                    onChange={(confirm_password) => this._handleFormChange({ confirm_password })}
                                    required={true}
                                />
                            </div>
                        </div>
                        <div className="link-buttons-container">
                            <input type="submit" style={{ display: "none" }} />
                            <Button rounded onClick={this._onPasswordChange}>Save Password</Button>
                            <Button rounded onClick={this._getUserData} variant={ButtonVariant.OUTLINE}>Cancel</Button>
                        </div>
                    </form>
                )}
            </div>
        );
    }

    private _onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const data = await this.context.api.updateUser(this.state);

        if (data && data.result && data.result.id) {
            this.setState({
                usernameErrorMsg: "",
            });

            return false;
        } else {
            this.setState({usernameErrorMsg: data.result.username});
        }
        return false;
    }

    private _onPasswordChange = async (event: React.FormEvent) => {
        event.preventDefault();
        if (this.state.confirm_password !== this.state.password) {
            this.setState({
                confirmPasswordErrorMsg: "Passwords do not match!",
            });
            return false;
        }

        if (this.state.password !== this.state.old_password) {
            this.setState({
                passwordErrorMsg: "You need to use a different password!",
            });
            return false;
        }

        const data = await this.context.api.updatePassword(this.state);

        if (data && data.result && data.result.id) {
            this._getUserData();
        } else {
            this.setState({
                passwordErrorMsg: data.result.password,
                oldPasswordErrorMsg: data.result.old_password,
                confirmPasswordErrorMsg: "",
            });
        }
        return false;
    }

    @autobind
    private async _getUserData() {
        const user = await this.context.api.getUser();
        if (user && user.username) {
            this.setState({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                username: user.username,
                profile_image_url: user.profile_image_url || this.state.profile_image_url,
                is_facebook_linked: user.is_facebook_linked,
                is_google_linked: user.is_google_linked,
                is_instagram_linked: user.is_instagram_linked,
                showPasswordChange: false,
                password: "",
                passwordErrorMsg: "",
                old_password: "",
                oldPasswordErrorMsg: "",
                confirm_password: "",
                confirmPasswordErrorMsg: "",
                usernameErrorMsg: "",
            });
        } else {
            this.props.history.push(`${this.props.location.pathname}/login`);
        }
    }

    private _handleFormChange = (data) => {
        this.setState(data);
    }

    private _authenticateGoogle = async (response: GoogleLoginResponseOffline) => {
        const token = await this.context.api.authenticateGoogle(response.code);
    }

    private _authenticateFacebook = async (response: FacebookLoginResponse) => {
        const token = this.context.api.authenticateFacebook(response.code);
    }

    private _onGoogleFailure = (response: GoogleLoginResponseOffline) => {
    }
}


Settings.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};

export default withRouter(Settings);
