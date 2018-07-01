import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { GoogleLogin, GoogleLoginResponseOffline } from "react-google-login";
import { withRouter } from "react-router-dom";

import { Person } from "../../api/models";
import { AppContext } from "../../app";
import Button, { ButtonVariant } from "../../components/button";
import Input, { InputType, InputVariant } from "../../components/input";
import FacebookLogin, { FacebookLoginResponse } from "../auth/facebookLogin";
import { AuthFormDataProps } from "../auth/types";
import RouteProps from "../routeProps";

type SettingsProps = RouteProps;

interface SettingsState extends AuthFormDataProps {
    username: string;
    first_name: string;
    last_name: string;
    profile_image_url: string;
    is_facebook_linked: boolean;
    is_google_linked: boolean;
    is_instagram_linked: boolean;
}

class Settings extends React.Component<SettingsProps, SettingsState> {
    static contextTypes: AppContext;

    state: SettingsState = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        username: "",
        profile_image_url: "",
        is_facebook_linked: false,
        is_google_linked: false,
        is_instagram_linked: false,
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

        const className = isMobile ? "auth-form mobile-auth-form" : "auth-form";

        return (
            <div className={className}>
                <form onSubmit={this._onSubmit}>
                    {/* <div>
                        <h4>Your Profile Photo</h4>
                        <Input
                            placeholder="Profile Image"
                            variant={InputVariant.OUTLINE}
                            type={InputType.FILE}
                            onChange={(username) => this._handleFormChange({ username })}
                        />
                    </div> */}
                    <div>
                        <h4>First Name</h4>
                        <Input
                            placeholder="First Name"
                            value={this.state.first_name}
                            variant={InputVariant.OUTLINE}
                            onChange={(first_name) => this._handleFormChange({ first_name })}
                            required={true}
                        />
                    </div>
                    <div>
                        <h4>Last Name</h4>
                        <Input
                            placeholder="Last Name"
                            value={this.state.last_name}
                            variant={InputVariant.OUTLINE}
                            onChange={(last_name) => this._handleFormChange({ last_name })}
                            required={true}
                        />
                    </div>
                    <div>
                        <h4>Username</h4>
                        <Input
                            placeholder="Username"
                            value={this.state.username}
                            variant={InputVariant.OUTLINE}
                            onChange={(username) => this._handleFormChange({ username })}
                            required={true}
                        />
                    </div>
                    <div>
                        <h4>Email</h4>
                        <Input
                            placeholder="Email Address"
                            value={this.state.email}
                            type={InputType.EMAIL}
                            variant={InputVariant.OUTLINE}
                            onChange={(email) => this._handleFormChange({ email })}
                            required={true}
                        />
                    </div>
                    <input type="submit" style={{ display: "none" }} />
                    <Input type={InputType.SUBMIT} value="Save Changes" />
                    <Button rounded onClick={this._getUserData} variant={ButtonVariant.OUTLINE}>Cancel</Button>
                </form>

                {!this.state.is_google_linked &&
                    <GoogleLogin
                        className="google-login"
                        clientId="174930742509-kvp3mkdgdb5c8staoesefgltj377tgsq.apps.googleusercontent.com"
                        responseType="code"
                        buttonText="Link Google"
                        onSuccess={this._authenticateGoogle}
                        onFailure={this._onGoogleFailure}
                    />
                }
                {!this.state.is_facebook_linked &&
                    <FacebookLogin
                        appId="201224070695370"
                        sdkVersion="v3.0"
                        fields="name,email,picture"
                        buttonText="Link Facebook"
                        responseType="code"
                        onCallback={this._authenticateFacebook}
                    />
                }
                <Button rounded onClick={() => this.props.history.push("/logout")}>Sign out</Button>
            </div>
        );
    }

    private _onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const data = await this.context.api.updateUser(this.state);
        return false;
    }

    private async _getUserData() {
        const user = await this.context.api.getUser();
        if (user && user.username) {
            this.setState({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                username: user.username,
                profile_image_url: user.profile_image_url,
                is_facebook_linked: user.is_facebook_linked,
                is_google_linked: user.is_google_linked,
                is_instagram_linked: user.is_instagram_linked,
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
