import autobind from "autobind-decorator";
import * as H from "history";
import * as React from "react";

import { IconButton } from "../../components/button";
import Icon, { IconSize, IconVariant } from "../../components/icon";
import * as Logo from "./logo.png";
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
                    <IconButton icon={IconVariant.MENU} size={IconSize.MEDIUM} onClick={this._toggleMenu} selected={false} />
                    <img
                        className="nav-logo"
                        src={Logo}
                        onClick={() => this.props.history.push(isShop ? "/shop/home" : "/discover")}
                    />
                    <Icon variant={IconVariant.GIRL} size={IconSize.MEDIUM} />
                </div>
            </div>
        );
    }

    @autobind
    private _toggleMenu() {
        if (!this.state.showMenu) {
            document.body.classList.add("noscroll");
        } else {
            document.body.classList.remove("noscroll");
        }

        this.setState({ showMenu: !this.state.showMenu });
    }
}
