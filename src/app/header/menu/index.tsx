import autobind from "autobind-decorator";
import * as H from "history";
import * as React from "react";
import { Link, withRouter } from "react-router-dom";

import Button, { ButtonVariant, LinkButton } from "../../../components/button";
import Icon, { IconVariant, SocialIcon, SocialIconType } from "../../../components/icon";
import * as Logo from "../../logo.png";

import "./style.scss";

interface MenuProps {
    open: boolean;
    isShop: boolean;
    loggedIn: boolean;
    location: any;
    history: H.History;
    toggleMenu(): void;
    subscribe(email: any): Promise<any>;
}

interface MenuState {
    subscribeEmail: string;
    success: boolean;
    fail: boolean;
}

class Menu extends React.Component<MenuProps, MenuState> {
    state: MenuState = {
        subscribeEmail: "",
        success: false,
        fail: false,
    };

    componentWillMount() {
        this._menuRef = React.createRef();
    }

    componentWillReceiveProps(nextProps: MenuProps) {
        if (this.props.open !== nextProps.open) {
            const menu = this._menuRef.current;
            if (nextProps.open) {
                menu.style.width = "calc(100%)";
            } else {
                menu.style.width = "0";
            }
        }
    }

    render() {
        const { isShop, loggedIn } = this.props;

        return (
            <div className="menu-container" ref={this._menuRef}>
                <div className="menu">
                    <div className="menu-header">
                        <span className="close" onClick={this.props.toggleMenu}>&times;</span>
                        <Link to={isShop ? "/shop" : "/"}>
                            <img
                                className="nav-logo"
                                src={Logo}
                                onClick={this.props.toggleMenu}
                            />
                        </Link>
                        <span />
                    </div>
                    <div className="menu-content">
                        <div className="nav-items">
                            <Link to="/looks" className="menu-item">
                                <div className="menu-item-text">
                                    Looks
                                </div>
                                <Icon variant={IconVariant.ARROW_RIGHT} />
                            </Link>
                            <Link to="/collections" className="menu-item">
                                <div className="menu-item-text">
                                    Collections
                                </div>
                                <Icon variant={IconVariant.ARROW_RIGHT} />
                            </Link>
                            <Link to="/editorials" className="menu-item">
                                <div className="menu-item-text">
                                    Editorials
                                </div>
                                <Icon variant={IconVariant.ARROW_RIGHT} />
                            </Link>
                            <Link to="/shop" className="menu-item">
                                <div className="menu-item-text">
                                    Shop
                                </div>
                                <Icon variant={IconVariant.ARROW_RIGHT} />
                            </Link>
                        </div>
                        <div className="follow-items">
                            <div className="menu-item-text">
                                Follow Us
                            </div>
                            <div className="follow-buttons">
                                <SocialIcon large icon={SocialIconType.FACEBOOK} />
                                <SocialIcon large icon={SocialIconType.INSTAGRAM} />
                                <SocialIcon large icon={SocialIconType.PINTEREST} />
                            </div>
                        </div>
                        <div className="menu-nav">
                            <LinkButton className="nav-item" to="/about">About TrendNine</LinkButton>
                            <LinkButton className="nav-item" to="/opportunities">I'm an Influencer</LinkButton>
                            <LinkButton className="nav-item" to="/terms">Terms & Conditions</LinkButton>
                            <LinkButton className="nav-item" to="/privacy">Privacy Policy</LinkButton>
                            <LinkButton className="nav-item" to="/contact">Contact Us</LinkButton>
                            {loggedIn ? (
                                <Button variant={ButtonVariant.OUTLINE} onClick={this._logout}>Sign Out</Button>
                            ) : (
                                <Button variant={ButtonVariant.OUTLINE} onClick={this._login}>Sign In / Join Now</Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private _menuRef: React.RefObject<HTMLDivElement>;

    private _subscribe = async (event) => {
        event.preventDefault();
        try {
            const response = await this.props.subscribe({ email: this.state.subscribeEmail });
            if (response.email) {
                this.setState({subscribeEmail: "", success: true});
                setTimeout(function() {
                    this.setState({success: false});
                }.bind(this), 5000);
            }
        } catch (err) {
            this.setState({ subscribeEmail: "", success: true });
            setTimeout(function() {
                this.setState({success: false});
            }.bind(this), 5000);
        }
        return false;
    }

    private _onSubscribeEmailChange = (subscribeEmail: string) => {
        this.setState({ subscribeEmail });
    }

    private _login = () => {
        this.props.toggleMenu();
        this.props.history.push("/login");
    }

    @autobind
    private _logout() {
        this.props.toggleMenu();
        this.props.history.push("/logout");
    }
}

export default withRouter(Menu);
