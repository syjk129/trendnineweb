import autobind from "autobind-decorator";
import * as H from "history";
import * as React from "react";
import { Link, withRouter } from "react-router-dom";

import { IconButton, LinkButton } from "../../../components/button";
import Icon, { IconSize, IconVariant } from "../../../components/icon";
import Input, { InputTheme, InputVariant } from "../../../components/input";
import * as LogoWhite from "../../logo_white.png";

import "./style.scss";

interface MenuProps {
    open: boolean;
    isShop: boolean;
    location: any;
    history: H.History;
    toggleMenu(): void;
}

interface MenuState {
    searchString: string;
}

class Menu extends React.Component<MenuProps, MenuState> {
    state: MenuState = {
        searchString: "",
    };

    render() {
        const { isShop } = this.props;

        return (
            <div className={`menu ${this.props.open && "open"}`}>
                <div className="menu-header">
                    <IconButton className="close" icon={IconVariant.MENU} size={IconSize.LARGE} onClick={this.props.toggleMenu} selected />
                    <Link to={isShop ? "/shop/discover" : "/discover"}>
                        <img
                            className="nav-logo"
                            src={LogoWhite}
                            onClick={this.props.toggleMenu}
                        />
                    </Link>
                </div>
                <div className="menu-content">
                    <div className="mobile-search">
                        <Input
                            value={this.state.searchString}
                            placeholder="Search"
                            theme={InputTheme.LIGHT}
                            variant={InputVariant.BLANK}
                            onChange={this._onInputChange}
                            onEnterPress={this._onSearch}
                        />
                        <Icon variant={IconVariant.SEARCH} />
                    </div>
                    <LinkButton
                        className="menu-link"
                        to={isShop ? "/shop/trending" : "/trending"}
                        onClick={this.props.toggleMenu}
                    >
                        Trending
                    </LinkButton>
                    <LinkButton
                        className="menu-link"
                        to={isShop ? "/shop/feed" : "/feed"}
                        onClick={this.props.toggleMenu}
                    >
                        Feed
                    </LinkButton>
                    <LinkButton
                        className="menu-link"
                        to={isShop ? "/shop/new" : "/new"}
                        onClick={this.props.toggleMenu}
                    >
                       New Arrivals
                    </LinkButton>
                    <div className="menu-divider" />
                    <LinkButton
                        className="menu-link"
                        to="/shop/discover"
                        onClick={this.props.toggleMenu}
                        selected={isShop}
                    >
                        Shop
                    </LinkButton>
                    <LinkButton
                        className="menu-link"
                        to="/discover"
                        onClick={this.props.toggleMenu}
                        selected={!isShop}
                    >
                        Discover
                    </LinkButton>
                    <div className="menu-divider" />
                    <LinkButton className="menu-link" onClick={this._logout}>
                        Sign Out
                    </LinkButton>
                </div>
            </div>
        );
    }

    @autobind
    private _onInputChange(searchString: string) {
        this.setState({ searchString });
    }

    @autobind
    private _logout() {
        this.props.toggleMenu();
        this.props.history.push("/logout");
    }

   @autobind
   private _onSearch() {
       this.props.toggleMenu();
       this.props.history.push(`${this.props.location.pathname}?keyword=${this.state.searchString}`);
   }
}

export default withRouter(Menu);
