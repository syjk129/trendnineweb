import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
import { GoogleLoginResponseOffline } from "react-google-login";

import RouteProps from "../../routeProps";
import { AuthData, FacebookLoginResponse } from "../types";
import DesktopAuthForm from "./desktop";

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
        return (
            <div>
                <BrowserView device={isBrowser}>
                    <DesktopAuthForm
                        {...this.state}
                        errors={this.props.errors}
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
        this.props.clearErrors();
        this.setState({ isNewUser: !this.state.isNewUser });
    }

    private _onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await this.props.authenticate(this.state);
        return false;
    }


    private _handleFormChange = (data: AuthData) => {
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
