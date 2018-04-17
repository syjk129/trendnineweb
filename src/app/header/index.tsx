import * as H from "history";
import * as React from "react";
import { match, withRouter } from "react-router-dom";

import Anchor from "../../components/anchor";
import Icon, { IconVariant } from "../../components/icon";
import Input, { InputType, InputVariant } from "../../components/input";
import NavLink from "../../components/navLink";
// import logo from "./logo.png";

import "./style.scss";

export interface HeaderProps {
    loggedIn: boolean;
    history: H.History;
    location: any;
}

export class Header extends React.Component<HeaderProps, never> {
    render() {
        const { loggedIn, history } = this.props;
        const onSearch = (value) => history.push({
            pathname: "/discover",
            search: `?q=${value}`,
        });

        const pathname = location.pathname;

        return (
            <div className="main-header">
                {/* <div className="user-header">
                    <div className="header-left-buttons">
                        <NavLink url="/shop" pathname={pathname}>
                            Shop
                        </NavLink>
                        <NavLink url="/discover" pathname={pathname}>
                            Discover
                        </NavLink>
                    </div>
                    <div className="header-right-buttons">
                        {!loggedIn &&
                            <NavLink url="/login" pathname={pathname}>Log In</NavLink>
                        }
                        {loggedIn &&
                            <div className="user-logged-in-buttons">
                                <Anchor>
                                    <Icon variant={IconVariant.BAG} large />
                                </Anchor>
                                <Anchor onClick={() => history.push("/profile")}>
                                    <Icon variant={IconVariant.GIRL} large />
                                </Anchor>
                            </div>
                        }
                    </div>
                </div> */}
                <div className="nav-header">
                    <div className="nav-logo" />
                    <div className="nav-header-links">
                        <div className="nav-pages">
                            <NavLink url="/discover" pathname={pathname} large>Trending</NavLink>
                            <NavLink url="/feed" pathname={pathname} large>Feed</NavLink>
                        </div>
                        <div className="search">
                            <Input variant={InputVariant.BLANK} placeholder="SEARCH" onEnterPress={ onSearch }/>
                            <div className="user-logged-in-buttons">
                                <Anchor onClick={() => history.push("/profile")}>
                                    <Icon variant={IconVariant.GIRL} large />
                                </Anchor>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);
