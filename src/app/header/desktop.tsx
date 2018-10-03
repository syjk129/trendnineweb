import * as React from "react";
import { Link } from "react-router-dom";

import { Category } from "../../api/models";
import Button, { ButtonVariant, IconButton, LinkButton } from "../../components/button";
import Callout, { CalloutVariant } from "../../components/callout";
import Icon, { IconSize, IconVariant, SocialIcon, SocialIconType } from "../../components/icon";
import Input, { InputVariant } from "../../components/input";
import NavLink from "../../components/navLink";
import Tab from "../../components/tab";
import { encodeCategoryUrl } from "../../util/urlUtil";
import * as Logo from "../logo.png";
import Banner from "./banner";

import "./style.scss";
import { HeaderProps } from "./types";

interface DesktopHeaderState {
    searchOpen: boolean;
    categories: Array<Category>;
    searchString: string;
    searchType: SearchTabs;
}

enum SearchTabs {
    LOOKS = "Looks",
    PRODUCTS = "Products",
    // INFLUENCERS = "Influencers",
}

export default class DesktopHeader extends React.Component<HeaderProps, DesktopHeaderState> {
    state: DesktopHeaderState = {
        searchOpen: false,
        categories: [],
        searchString: "",
        searchType: SearchTabs.LOOKS,
    };

    componentWillMount() {
        this._headerRef = React.createRef();
        this._logoRef = React.createRef();
        this._userButtonRef = React.createRef();
        this._placeholderRef = React.createRef();
        this._topHeaderRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener("scroll", this._onScroll);
        document.addEventListener("touchmove", this._onScroll);
    }

    componentDidUpdate(previousProps: HeaderProps) {
        if (previousProps.bannerContent !== this.props.bannerContent) {
            if (this._placeholderRef.current && this._headerRef.current) {
                this._placeholderRef.current.style.height = `${this._headerRef.current.getBoundingClientRect().height}px`;
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", this._onScroll);
        document.removeEventListener("touchmove", this._onScroll);
    }

    render() {
        const { loggedIn } = this.props;
        const user = JSON.parse(localStorage.getItem("user"));

        return (
            <>
                <div className="header-placeholder" ref={this._placeholderRef} />
                <div className="main-header" id="header" ref={this._headerRef}>
                    {this.props.bannerAction && this.props.bannerContent && this.props.location.pathname === "/" && (
                        <Banner actionButton={this.props.bannerAction} onDismiss={this.props.dismissBanner}>
                            {this.props.bannerContent}
                        </Banner>
                    )}
                    <div className="header-content">
                        <div className="top-header" ref={this._topHeaderRef}>
                            <div className="social-icons">
                                <SocialIcon icon={SocialIconType.FACEBOOK} />
                                <SocialIcon icon={SocialIconType.PINTEREST} />
                                <SocialIcon icon={SocialIconType.INSTAGRAM} />
                            </div>
                            <Link
                                className="nav-logo-container"
                                to="/"
                            >
                                <img className="nav-logo" src={Logo} />
                            </Link>
                            <div className="user-buttons">
                                {(!loggedIn || !user) &&
                                    <Button
                                        small
                                        className="login-button"
                                        variant={ButtonVariant.OUTLINE}
                                        url={{
                                            pathname: "/login",
                                            state: { modal: true },
                                        }}
                                    >
                                        Sign In / Join
                                    </Button>
                                }
                                {loggedIn && user &&
                                    <div className="user-logged-in-buttons">
                                        <IconButton icon={IconVariant.SEARCH} size={IconSize.LARGE} onClick={this._toggleSearch}/>
                                        <LinkButton to={`/user/${user.username}/wishlist`}>
                                            <Icon variant={IconVariant.WISHLIST} size={IconSize.LARGE} />
                                        </LinkButton>
                                        <LinkButton to={`/user/${user.username}`}>
                                            <Icon variant={IconVariant.PROFILE} size={IconSize.LARGE} />
                                        </LinkButton>
                                        {this.state.searchOpen && (
                                            <div className="search-box-container">
                                                <div className="search-tabs">
                                                    {Object.keys(SearchTabs).map(key => (
                                                        <Tab
                                                            selected={this.state.searchType === SearchTabs[key]}
                                                            label={SearchTabs[key]}
                                                            onSelect={() => this._selectSearchType(SearchTabs[key])}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="search-box">
                                                    <Input
                                                        value={this.state.searchString}
                                                        onChange={this._onSearchStringChange}
                                                        variant={InputVariant.BLANK}
                                                        onEnterPress={this._onSearch}
                                                    />
                                                    <span className="close" onClick={this._toggleSearch}>&times;</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="bottom-header">
                            <Link
                                className="nav-logo-container"
                                to="/"
                            >
                                <img className="nav-logo" src={Logo} ref={this._logoRef}/>
                            </Link>
                            <div className="header-links">
                                <NavLink
                                    className="header-link"
                                    pathname={this.props.location.pathname}
                                    url="/looks"
                                >
                                    Looks
                                    {this._renderLookSubheader()}
                                </NavLink>
                                <NavLink
                                    className="header-link"
                                    pathname={this.props.location.pathname}
                                    url="/collections"
                                >
                                    Collections
                                </NavLink>
                                <NavLink
                                    className="header-link"
                                    pathname={this.props.location.pathname}
                                    url="/editorials"
                                >
                                    Editorials
                                </NavLink>
                                <NavLink
                                    className="header-link"
                                    pathname={this.props.location.pathname}
                                    url="/shop"
                                >
                                    Shop
                                    {this._renderCategorySubheader()}
                                </NavLink>
                            </div>
                            <div className="user-buttons" ref={this._userButtonRef}>
                                {(!loggedIn || !user) &&
                                    <Button
                                        className="login-button"
                                        small
                                        variant={ButtonVariant.OUTLINE}
                                        url={{
                                            pathname: "/login",
                                            state: { modal: true },
                                        }}
                                    >
                                        Sign In / Join
                                    </Button>
                                }
                                {loggedIn && user &&
                                    <div className="user-logged-in-buttons">
                                        <IconButton icon={IconVariant.SEARCH} size={IconSize.LARGE} onClick={this._toggleSearch} />
                                        <LinkButton to={`/user/${user.username}/wishlist`}>
                                            <Icon variant={IconVariant.WISHLIST} size={IconSize.LARGE} />
                                        </LinkButton>
                                        <LinkButton to={`/user/${user.username}`}>
                                            <Icon variant={IconVariant.PROFILE} size={IconSize.LARGE} />
                                        </LinkButton>
                                        {this.state.searchOpen && (
                                            <div className="search-box-container">
                                                <div className="search-tabs">
                                                    {Object.keys(SearchTabs).map(key => (
                                                        <Tab
                                                            selected={this.state.searchType === SearchTabs[key]}
                                                            label={SearchTabs[key]}
                                                            onSelect={() => this._selectSearchType(SearchTabs[key])}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="search-box">
                                                    <Input
                                                        value={this.state.searchString}
                                                        onChange={this._onSearchStringChange}
                                                        variant={InputVariant.BLANK}
                                                        onEnterPress={this._onSearch}
                                                    />
                                                    <span className="close" onClick={this._toggleSearch}>&times;</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    private _placeholderRef: React.RefObject<HTMLDivElement>;
    private _headerRef: React.RefObject<HTMLDivElement>;
    private _logoRef: React.RefObject<HTMLImageElement>;
    private _userButtonRef: React.RefObject<HTMLDivElement>;
    private _topHeaderRef: React.RefObject<HTMLDivElement>;

    private _renderCategorySubheader = () => {
        return (
            <div className="subheader">
                <div className="category-subheader">
                    {this.props.categories.map(category => (
                        <div className="category-container">
                            <div className="category">
                                <NavLink
                                    pathname={this.props.location.pathname}
                                    url={{
                                        pathname: `/shop/${encodeCategoryUrl(category.full_name)}`,
                                        state: { refresh: true },
                                    }}
                                >
                                    {category.display_name}
                                </NavLink>
                            </div>
                            {category.subcategories.map(subcategory => (
                                <div className="subcategory">
                                    <NavLink
                                        small
                                        muted
                                        pathname={this.props.location.pathname}
                                        url={{
                                            pathname: `/shop/${encodeCategoryUrl(category.full_name)}/${encodeCategoryUrl(subcategory.full_name)}`,
                                            state: { refresh: true },
                                        }}
                                    >
                                        {subcategory.display_name}
                                    </NavLink>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    private _renderLookSubheader = () => {
        return (
            <div className="subheader">
                <div className="subheader-section">
                    <Callout variant={CalloutVariant.SECONDARY}>By Style</Callout>
                    {this.props.styles.map(style => (
                        <div className="subheader-link">
                            <NavLink
                                muted
                                small
                                pathname={this.props.location.pathname}
                                url={{
                                    pathname: "/looks",
                                    search: `tags=${style.content}`,
                                    state: { refresh: true },
                                }}
                            >
                                {style.content}
                            </NavLink>
                        </div>
                    ))}
                </div>
                <div className="subheader-section">
                    <Callout variant={CalloutVariant.SECONDARY}>By Occasions</Callout>
                    {this.props.occasions.map(occasion => (
                        <div className="subheader-link">
                            <NavLink
                                muted
                                small
                                pathname={this.props.location.pathname}
                                url={{
                                    pathname: "/looks",
                                    search: `tags=${occasion.content}`,
                                    state: { refresh: true },
                                }}
                            >
                                {occasion.content}
                            </NavLink>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    private _selectSearchType = (searchType: SearchTabs) => {
        this.setState({ searchType });
    }

    private _onSearch = () => {
        this._toggleSearch();
        switch (this.state.searchType) {
            case SearchTabs.PRODUCTS:
                this.props.history.push({
                    pathname: "/shop",
                    search: `keyword=${this.state.searchString}`,
                    state: { refresh: true },
                });
                break;
            case SearchTabs.LOOKS:
            default:
                this.props.history.push({
                    pathname: "/looks",
                    search: `keyword=${this.state.searchString}`,
                    state: { refresh: true },
                });
                break;
        }
    }

    private _onSearchStringChange = (searchString: string) => {
        this.setState({ searchString });
    }

    private _toggleSearch = () => {
        this.setState({ searchOpen: !this.state.searchOpen });
    }

    private _onScroll = () => {
        const header = this._headerRef.current;
        const logo = this._logoRef.current;
        const userButtons = this._userButtonRef.current;
        const topHeader = this._topHeaderRef.current;
        const placeholderRef = this._placeholderRef.current;

        if (header) {
            if (window.scrollY > header.getBoundingClientRect().height) {
                header.style.position = "fixed";
                topHeader.style.display = "none";
                logo.style.visibility = "visible";
                userButtons.style.visibility = "visible";
                placeholderRef.style.height = `${header.getBoundingClientRect().height}px`;
            } else {
                header.style.position = "relative";
                topHeader.style.display = "flex";
                logo.style.visibility = "hidden";
                userButtons.style.visibility = "hidden";
                placeholderRef.style.height = "0px";
            }
        }
    }
}
