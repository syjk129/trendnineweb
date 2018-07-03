import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { GoogleLoginResponseOffline } from "react-google-login";

import { AppContext } from "../../app";
import Modal from "../../components/modal";
import RouteProps from "../routeProps";
import AuthForm from "./authForm";
import { FacebookLoginResponse } from "./facebookLogin";
import { AuthData } from "./types";


interface AuthProps extends RouteProps {
    apiUrl: string;
    close(redirect?: string): void;
    setLoggedState(loggedIn: boolean): void;
}

interface AuthState {
    errors: any;
}

export default class Auth extends React.Component<AuthProps, AuthState> {
    static contextTypes: AppContext;

    state: AuthState = {
        errors: [],
    };

    constructor(props) {
        super(props);
        if (props.match.path === "/logout") {
            this._logout();
        } else {
            const user = localStorage.getItem("user");
            const token = localStorage.getItem("tn_auth_token");

            if (user !== null && user !== "undefined" && token && token !== "undefined") {
                const exp = JSON.parse(atob(token.split(".")[1]))["exp"];
                const current = (new Date()).getTime() / 1000;

                if (exp > current) {
                    this.props.history.push("/");
                } else {
                    localStorage.removeItem("tn_auth_token");
                }
            }
        }
    }

    render() {
        return (
            <Modal className="auth-modal" isOpen close={this.props.close}>
                <AuthForm
                    errors={this.state.errors}
                    authenticate={this._authenticate}
                    authenticateFacebook={this._authenticateFacebook}
                    authenticateGoogle={this._authenticateGoogle}
                    clearErrors={this._clearErrors}
                    history={this.props.history}
                    location={this.props.location}
                    match={this.props.match}
                />
            </Modal>
        );
    }

    private _authenticate = async (data: AuthData) => {
        const response = await this.context.api.authenticate(data.email, data.password, data.isNewUser, data.firstName, data.lastName);
        if (response.token) {
            this._setToken(response);
            // save token.token
            await this._setLoggedInUser();
            this.props.setLoggedState(true);
            if (data.isNewUser) {
                this.props.close("/onboarding");
            } else {
                this.props.close();
            }
        } else {
            if (response["non_field_errors"]) {
                alert(response["non_field_errors"]);
            } else {
                this.setState({ errors: response });
            }
        }
    }

    private _clearErrors = () => {
        this.setState({ errors: null });
    }

    private _setLoggedInUser = async () => {
        const user = await this.context.api.getUser();
        if (user && user.username) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }

    private _authenticateGoogle = async (response: GoogleLoginResponseOffline) => {
        const token = await this.context.api.authenticateGoogle(response.code);
        this._setToken(token);
        await this._setLoggedInUser();
        this.props.setLoggedState(true);
        this.props.close();
    }

    private _authenticateFacebook = async (response: FacebookLoginResponse) => {
        const token = this.context.api.authenticateFacebook(response.code);
        this._setToken(token);
        await this._setLoggedInUser();
        this.props.setLoggedState(true);
        this.props.close();
    }

    @autobind
    private _isFacebookLoginCallback(): boolean {
        return this.props.location.pathname === "/login/facebook/callback";
    }

    @autobind
    private _logout() {
        this.props.setLoggedState(false);
        localStorage.removeItem("user");
        localStorage.removeItem("tn_auth_token");
        this.props.history.push("/");
    }

    private _setToken = (token: any) => {
        if (token.token) {
            localStorage.setItem("tn_auth_token", token.token);
        }
    }
}

Auth.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
