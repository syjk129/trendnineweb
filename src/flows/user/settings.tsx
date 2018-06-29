import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { GoogleLogin, GoogleLoginResponseOffline } from "react-google-login";
import { withRouter } from "react-router-dom";

import { Person } from "../../api/models";
import { AppContext } from "../../app";
import Button from "../../components/button";
import Input, { InputVariant } from "../../components/input";
import FacebookLogin, { FacebookLoginResponse } from "../auth/facebookLogin";
import { AuthData } from "../auth/types";
import RouteProps from "../routeProps";

type SettingsProps = RouteProps;

interface SettingsState extends AuthData {
    username: string;
    first_name: string;
    last_name: string;
}

class Settings extends React.Component<SettingsProps, SettingsState> {
    static contextTypes: AppContext;

    state: SettingsState = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        username: "",
        isNewUser: false,
    };

    componentWillMount() {
        const rawUser = localStorage.getItem("user");
        let user: Person;
        console.log(rawUser);
        if (rawUser && rawUser !== "undefined") {
            user = JSON.parse(rawUser);
            this.setState({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                username: user.username,
            });
        } else {
            this.props.history.push(`${this.props.location.pathname}/login`);
        }
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
                    <Input
                        placeholder="Profile Image"
                        variant={InputVariant.OUTLINE}
                        // onChange={(username) => this._handleFormChange({ username })}
                    />
                    <Input
                        placeholder="First Name"
                        value={this.state.first_name}
                        variant={InputVariant.OUTLINE}
                        // onChange={(username) => this._handleFormChange({ username })}
                    />
                    <Input
                        placeholder="Last Name"
                        value={this.state.last_name}
                        variant={InputVariant.OUTLINE}
                        // onChange={(username) => this._handleFormChange({ username })}
                    />
                    <Input
                        placeholder="Username"
                        value={this.state.username}
                        variant={InputVariant.OUTLINE}
                        // onChange={(username) => this._handleFormChange({ username })}
                    />
                    <Input
                        placeholder="Email Address"
                        value={this.state.email}
                        variant={InputVariant.OUTLINE}
                        // onChange={(email) => this._handleFormChange({ email })}
                    />
                    <input type="submit" style={{ display: "none" }} />
                    <Button onClick={this._onSubmit}>Save</Button>
                </form>

                <GoogleLogin
                    className="google-login"
                    clientId="174930742509-kvp3mkdgdb5c8staoesefgltj377tgsq.apps.googleusercontent.com"
                    responseType="code"
                    onSuccess={this._authenticateGoogle}
                    onFailure={this._onGoogleFailure}
                />
                <FacebookLogin
                    appId="201224070695370"
                    sdkVersion="v3.0"
                    fields="name,email,picture"
                    responseType="code"
                    onCallback={this._authenticateFacebook}
                />
            </div>
        );
    }

    private _onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // await this.props.authenticate(this.state);
        // await this._setLoggedInUser();
        return false;
    }

    private _handleFormChange = (data: AuthData) => {
        this.setState({
            email: data.email,
            password: data.password,
            // username: data.username,
            isNewUser: false,
        });
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
