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

export default class Auth extends React.Component<AuthProps> {
    static contextTypes: AppContext;

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
                    getUser={this._getUser}
                    authenticate={this._authenticate}
                    authenticateFacebook={this._authenticateFacebook}
                    authenticateGoogle={this._authenticateGoogle}
                    history={this.props.history}
                    location={this.props.location}
                    match={this.props.match}
                />
            </Modal>
        );
    }

    private _authenticate = async (data: AuthData) => {
        const token = await this.context.api.authenticate(data.email, data.password, data.isNewUser);
        this._setToken(token);
        // save token.token
        this.props.setLoggedState(true);
        if (data.isNewUser) {
            this.props.close("/onboarding");
        } else {
            this.props.close();
        }
    }

    @autobind
    private _getUser() {
        return this.context.api.getUser();
    }

    private _authenticateGoogle = async (response: GoogleLoginResponseOffline) => {
        const token = await this.context.api.authenticateGoogle(response.code);
        this.props.setLoggedState(true);
        this.props.close();
    }

    private _authenticateFacebook = async (response: FacebookLoginResponse) => {
        const token = this.context.api.authenticateFacebook(response.code);
        this._setToken(token);
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
            // const date = new Date();
            // date.setDate(new Date(Date.now()).getDate() + 5);
            // Cookies.setCookie("tn_auth_token", token.token, date);
        }
    }
}

Auth.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
