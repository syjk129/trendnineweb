import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";

import { AppContext } from "../../app";
import RouteProps from "../../flows/routeProps";

import DesktopFooter from "./desktop";
import MobileFooter from "./mobile";
import "./style.scss";


type Props = RouteProps;

interface FooterState {
    email: string;
    success: boolean;
}

export default class Footer extends React.Component<Props, FooterState> {
    static contextTypes: AppContext;

    state: FooterState = {
        email: "",
        success: false,
    };

    render() {
        return (
            <>
                <BrowserView device={isBrowser}>
                    <DesktopFooter
                        email={this.state.email}
                        success={this.state.success}
                        onEmailChange={this._onInputChange}
                        submit={this._onSubmit}
                    />
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobileFooter
                        email={this.state.email}
                        success={this.state.success}
                        onEmailChange={this._onInputChange}
                        submit={this._onSubmit}
                    />
                </MobileView>
            </>
        );
    }

    @autobind
    private _onInputChange(email: string) {
        this.setState({ email });
    }

    @autobind
    private async _onSubmit(event) {
        event.preventDefault();
        try {
            const response = await this.context.api.subscribe(this.state);
            if (response.result.email) {
                this.setState({email: "", success: true});
                setTimeout(function() {
                    this.setState({success: false});
                }.bind(this), 5000);
            }
        } catch (err) {
            this.setState({ email: "", success: true});
            setTimeout(function() {
                this.setState({success: false});
            }.bind(this), 5000);
        }
        return false;
    }
}

Footer.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
