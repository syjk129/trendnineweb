import * as H from "history";
import * as React from "react";
import { match, withRouter } from "react-router-dom";

import { Person } from "../../api/models";
import WithUserSession from "../../app/withUserSession";
import { LinkButton } from "../../components/button/index";
import Icon, { IconSize, IconVariant } from "../../components/icon";
import Input, { InputType, InputVariant } from "../../components/input";
import NavLink from "../../components/navLink";

import "./style.scss";

export interface HeaderProps {
    loggedIn: boolean;
    history: H.History;
    location: any;
    user: Person;
}

class Header extends React.Component<HeaderProps> {
    render() {
        const { loggedIn, history, user } = this.props;
        const onSearch = (value) => history.push({
            pathname: "/discover",
            search: `?keyword=${value}`,
        });

        const pathname = location.pathname;
        const isShop = pathname.indexOf("/shop") > -1;

        return (
            <div className="main-header">
                <div className="user-header">
                    <div className="header-left-buttons">
                        <NavLink url="/discover" pathname={pathname}>
                            Discover
                        </NavLink>
                        <NavLink url="/shop/home" pathname={pathname}>
                            Shop
                        </NavLink>
                    </div>
                    <div className="header-right-buttons">
                        {!loggedIn &&
                            <NavLink url="/login" pathname={pathname}>Log In</NavLink>
                        }
                        {loggedIn &&
                            <div className="user-logged-in-buttons">
                                <LinkButton onClick={() => history.push(`/user/${user.username}`)}>
                                    <Icon variant={IconVariant.GIRL} size={IconSize.MEDIUM} />
                                </LinkButton>
                            </div>
                        }
                    </div>
                </div>
                <div className="nav-header">
                    <div className="nav-logo" onClick={() => history.push(isShop ? "/shop/home" : "/discover")} />
                    <div className="nav-header-links">
                        <div className="nav-pages">
                            <NavLink url={isShop ? "/shop/discover" : "/discover"} pathname={pathname} large>Trending</NavLink>
                            <NavLink url={isShop ? "/shop/feed" : "/feed"} pathname={pathname} large>Feed</NavLink>
                        </div>
                        <div className="search">
                            <Input variant={InputVariant.BLANK} placeholder="SEARCH" onEnterPress={ onSearch }/>
                            <Icon variant={IconVariant.SEARCH}></Icon>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(WithUserSession(Header));
