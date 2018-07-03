import autobind from "autobind-decorator";
import * as React from "react";
import { ChangeEvent } from "react";

import Button, { IconButton } from "../../components/button";
import Input, { InputType } from "../../components/input";
import { AuthData, AuthFormProps } from "./types";

import "./style.scss";

const CALLBACK_URL_PATH = "/facebook/callback";

interface FacebookLoginProps {
    appId: string;
    sdkVersion: string;
    fields: string;
    responseType: string;
    buttonText?: string;
    disabled?: boolean;
    onCallback(response: FacebookLoginResponse): void;
}

interface FacebookLoginState {}

export class FacebookLoginResponse {
    code: string;
    error?: string;
}

export default class FacebookLogin extends React.Component<FacebookLoginProps, FacebookLoginState> {
    render() {
        const buttonText = this.props.buttonText ? this.props.buttonText : "Login with Facebook";
        return (
            <Button className="facebook-login" onClick={this._openLoginWindow} disabled={this.props.disabled}>{buttonText}</Button>
        );
    }

    @autobind
    private _openLoginWindow() {
        const width = 450;
        const height = 300;
        const x = screen.width / 2 - width / 2;
        const y = screen.height / 2 - height / 2;
        const onCallback = this.props.onCallback;
        const url = `https://www.facebook.com/${this.props.sdkVersion}/dialog/oauth?`
                    + `&client_id=${this.props.appId}`
                    + `&redirect_uri=${window.location.href}${CALLBACK_URL_PATH}`
                    + `&response_type=${this.props.responseType}`
                    + `&scope=email,public_profile`
                    + `&display=popup`;

        let externalWindow = window.open(url, "_blank", `width=${width},height=${height},left=${x},top=${y},status=yes`);
        this._detectUrlChange(externalWindow, this.props.onCallback);
    }

    @autobind
    private _detectUrlChange(externalWindow: Window, callbackOnLogin: (response: FacebookLoginResponse) => void)  {
        const interval = setInterval(function() {
            if (externalWindow.location.pathname && externalWindow.location.pathname.endsWith(CALLBACK_URL_PATH)) {
                const code = new URL(externalWindow.location.href).searchParams.get("code");

                // call provided callback function
                callbackOnLogin({ code: code });

                // clean interval and close window.
                clearInterval(interval);
                externalWindow.close();
            }
        }, 500);
    }
}

