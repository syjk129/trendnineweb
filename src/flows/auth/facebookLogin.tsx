import autobind from "autobind-decorator";
import * as React from "react";
import { ChangeEvent } from "react";

import { IconButton } from "../../components/button/index";
import Input, { InputType } from "../../components/input";

import { AuthData, AuthFormProps, SocialLoginResponse } from "./types";

const CALLBACK_URL_PATH = "/facebook/callback";

interface FacebookLoginProps {
    appId: string;
    sdkVersion: string;
    fields: string;
    responseType: string;
    onCallback(response: FacebookLoginResponse): void;
}

interface FacebookLoginState {}

export class FacebookLoginResponse {
    code: string;
    error?: string;
}

export default class FacebookLogin extends React.Component<FacebookLoginProps, FacebookLoginState> {
    render() {
        return (
            <div className="button">
                <button onClick={this._openLoginWindow}>Login with Facebook</button>
            </div>
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

