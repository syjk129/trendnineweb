import autobind from "autobind-decorator";
import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { IconButton, LinkButton } from "../../../components/button";
import Icon, { IconVariant } from "../../../components/icon";
import Input, { InputTheme, InputVariant } from "../../../components/input";
import * as LogoWhite from "../logo_white.png";

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
        return (
            <div className={`menu ${this.props.open && "open"}`}>
                <div className="menu-header">
                    <IconButton className="close" icon={IconVariant.MENU} onClick={this.props.toggleMenu} selected />
                    <img
                        className="nav-logo"
                        src={LogoWhite}
                        onClick={() => this.props.history.push(this.props.isShop ? "/shop/home" : "/discover")}
                    />
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
                    <LinkButton onClick={this._onMenuClick("trending")}>Trending</LinkButton>
                    <LinkButton onClick={this._onMenuClick("feed")}>Feed</LinkButton>
                    <LinkButton onClick={this._onMenuClick("new")}>New Arrivals</LinkButton>
                    <LinkButton onClick={this._onMenuClick("brands")}>Brands</LinkButton>
                </div>
            </div>
        );
    }

    @autobind
    private _onInputChange(searchString: string) {
        this.setState({ searchString });
    }

    @autobind
    private _onMenuClick(url: string) {
        return () => {
            this.props.toggleMenu();
            if (this.props.isShop) {
                this.props.history.push(`/shop/${url}`);
            } else {
                this.props.history.push(`/${url}`);
            }
        };
   }

   @autobind
   private _onSearch() {
       this.props.toggleMenu();
       this.props.history.push(this.state.searchString);
   }
}

export default withRouter(Menu);
