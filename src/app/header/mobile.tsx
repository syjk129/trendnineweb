import autobind from "autobind-decorator";
import * as H from "history";
import * as React from "react";

import { IconButton } from "../../components/button";
import Icon, { IconSize, IconVariant } from "../../components/icon";
import Menu from "./menu";

import "./style.scss";
import { HeaderProps } from "./types";

interface MobileHeaderState {
    showMenu: boolean;
}

export default class MobileHeader extends React.Component<HeaderProps, MobileHeaderState> {
    state: MobileHeaderState = {
        showMenu: false,
    };

    render() {
        const pathname = this.props.location.pathname;
        const isShop = pathname.indexOf("/shop") > -1;

       return (
            <div className="header">
                <Menu open={this.state.showMenu} toggleMenu={this._toggleMenu} isShop={isShop} />
                <div className="mobile-header">
                    <IconButton icon={IconVariant.MENU} onClick={this._toggleMenu} selected={false} />
                    <div
                        className="nav-logo"
                        onClick={() => this.props.history.push(isShop ? "/shop/home" : "/discover")}
                    />
                    <Icon variant={IconVariant.GIRL} />
                </div>
            </div>
        );
    }

    @autobind
    private _toggleMenu() {
        console.log("toggle");
        this.setState({ showMenu: !this.state.showMenu });
    }
}