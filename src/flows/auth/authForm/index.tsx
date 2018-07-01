import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
import { GoogleLoginResponseOffline } from "react-google-login";

import { Person } from "../../../api/models";
import RouteProps from "../../routeProps";
import { AuthData, FacebookLoginResponse } from "../types";
import DesktopAuthForm from "./desktop";

import "./style.scss";

interface AuthFormProps extends RouteProps {
    getUser(): Promise<Person>;
    authenticate(data: AuthData): void;
    authenticateFacebook(response: FacebookLoginResponse): Promise<void>;
    authenticateGoogle(response: GoogleLoginResponseOffline): Promise<void>;
}

type AuthFormState = AuthData;

export default class AuthForm extends React.Component<AuthFormProps, AuthFormState> {
    state: AuthFormState = {
        email: "",
        password: "",
        isNewUser: true,
    };

    render() {
        return (
            <div>
                <BrowserView device={isBrowser}>
                    <DesktopAuthForm
                        {...this.state}
                        toggleNewUser={this._toggleNewUser}
                        onFormChange={this._handleFormChange}
                        onSubmit={this._onSubmit}
                        onGoogleSuccess={this._onGoogleSuccess}
                        onGoogleFailure={this._onGoogleFailure}
                        onFacebookLogin={this._onFacebookLogin}
                    />
                </BrowserView>
                <MobileView device={isMobile}>
                </MobileView>
            </div>
        );
    }

    private _toggleNewUser = () => {
        this.setState({ isNewUser: !this.state.isNewUser });
    }

    private _onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await this.props.authenticate(this.state);
        await this._setLoggedInUser();
        return false;
    }

    private _setLoggedInUser = async () => {
        const user = await this.props.getUser();
        if (user && user.username) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }

    private _handleFormChange = (data: AuthData) => {
        this.setState({
            email: data.email !== undefined ? data.email : this.state.email,
            password: data.password !== undefined ? data.password : this.state.password,
        });
    }

    private _onGoogleSuccess = (response: GoogleLoginResponseOffline) => {
        this.props.authenticateGoogle(response);
        this._setLoggedInUser();
    }

    private _onGoogleFailure = (response: GoogleLoginResponseOffline) => {
    }

    private _onFacebookLogin = (response: FacebookLoginResponse) => {
        if (!response.error) {
            this.props.authenticateFacebook(response);
            this._setLoggedInUser();
        }
    }
}
