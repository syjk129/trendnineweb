import autobind from "autobind-decorator";
import * as H from "history";
import * as React from "react";
import { Link } from "react-router-dom";

import { IconButton } from "../../components/button";
import Icon, { IconSize, IconVariant } from "../../components/icon";
import * as Logo from "../logo.png";
import WithUserSession from "../withUserSession";
import Menu from "./menu";
import { HeaderProps } from "./types";

import "./style.scss";

interface MobileHeaderState {
    showMenu: boolean;
}

class MobileHeader extends React.Component<HeaderProps, MobileHeaderState> {
    state: MobileHeaderState = {
        showMenu: false,
    };

    render() {
        const { user } = this.props;
        const pathname = this.props.location.pathname;
        const isShop = pathname.indexOf("/shop") > -1;

       return (
            <div className="header">
                <Menu open={this.state.showMenu} loggedIn={!!user} toggleMenu={this._toggleMenu} isShop={isShop} />
                <div className="mobile-header">
                    <IconButton icon={IconVariant.MENU} size={IconSize.LARGE} onClick={this._toggleMenu} selected={false} />
                    <Link className="nav-logo-container" to={isShop ? "/shop/discover" : "/discover"}>
                        <img
                            className="nav-logo"
                            src={Logo}
                        />
                    </Link>
                    <IconButton icon={IconVariant.PROFILE} size={IconSize.LARGE} url={user ? `/user/${user.id}` : "/login"}/>
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

export default WithUserSession(MobileHeader);
