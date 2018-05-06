import * as H from "history";
import * as React from "react";
import { match, withRouter } from "react-router-dom";

import { Person } from "../../api/models";
import { LinkButton } from "../../components/button/index";
import Icon, { IconSize, IconVariant } from "../../components/icon";
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
        const user: Person = JSON.parse(localStorage.getItem("user"));

        return (
            <div className="main-header">
                <div className="nav-header">
                    <div className="nav-logo" onClick={() => history.push("/discover")} />
                    <div className="nav-header-links">
                        <div className="nav-pages">
                            <NavLink url="/discover" pathname={pathname} large>Trending</NavLink>
                            <NavLink url="/feed" pathname={pathname} large>Feed</NavLink>
                        </div>
                        <div className="search">
                            <Icon variant={IconVariant.SEARCH}></Icon>
                            <Input variant={InputVariant.BLANK} placeholder="SEARCH" onEnterPress={ onSearch }/>
                            <div className="user-logged-in-buttons">
                                <LinkButton onClick={() => history.push(`/user/${user.username}`)}>
                                    <Icon variant={IconVariant.GIRL} size={IconSize.LARGE} />
                                </LinkButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);
