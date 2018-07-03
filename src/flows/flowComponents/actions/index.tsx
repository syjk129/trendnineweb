import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { AppContext, AppContextTypes } from "../../../app";
import { IconButton, LinkButton } from "../../../components/button";
import { IconSize, IconVariant } from "../../../components/icon";
import RouteProps from "../../routeProps";
import FacebookShare from "../share/facebookShare";

import "./style.scss";

export enum ActionLinksVariant {
    POST = "blog",
    PRODUCT = "product",
}

const ActionLinksVariantMap = {
    [ActionLinksVariant.POST]: "post",
    [ActionLinksVariant.PRODUCT]: "product",
};

interface ActionLinksProps extends RouteProps {
    variant: ActionLinksVariant;
    id: string;
    wishlisted: boolean;
    likes?: number;
    liked?: boolean;
    iconSize?: IconSize;
}

interface ActionLinksState {
    likes: number;
    liked: boolean;
    wishlisted: boolean;
}

class ActionLinks extends React.Component<ActionLinksProps, ActionLinksState>  {
    static contextTypes: AppContext;

    state: ActionLinksState = {
        likes: this.props.likes,
        liked: this.props.liked,
        wishlisted: this.props.wishlisted,
    };

    render() {
        let shareUrl;
        const pathname = window.location.pathname.split("/").filter(path => path !== "");
        if (pathname.length === 2) {
            shareUrl = `${window.location.pathname}/share`;
        } else {
            shareUrl = `/share/${ActionLinksVariantMap[this.props.variant]}/${this.props.id}`;
        }

        return (
            <div className="action-btns">
                <div className="user-actions">
                    {this.props.variant === ActionLinksVariant.POST &&
                        <span className="likes">
                            <IconButton
                                icon={IconVariant.LIKE}
                                size={this.props.iconSize}
                                selected={this.state.liked}
                                onClick={this._likeUnlikePost}
                            >
                            </IconButton>
                            {this.state.likes > 0 && this.state.likes}
                        </span>
                    }
                    <IconButton
                        icon={IconVariant.SHARE}
                        size={this.props.iconSize}
                        selected={this.state.wishlisted}
                        onClick={() => this.props.history.push(shareUrl)}
                    />
                </div>
                <IconButton
                    icon={this.props.variant === ActionLinksVariant.POST ? IconVariant.BOOKMARK : IconVariant.WISHLIST}
                    size={this.props.iconSize}
                    selected={this.state.wishlisted}
                    onClick={this._wishlistUnwishlist}
                />
            </div>
        );
    }

    @autobind
    private _wishlistUnwishlist() {
        if (this.state.wishlisted) {
            this.context.api.unwishlist(this.props.id, this.props.variant);
            this.setState({ wishlisted: false });
        } else {
            this.context.api.wishlist(this.props.id, this.props.variant);
            this.setState({ wishlisted: true });
        }
    }

    @autobind
    private _likeUnlikePost() {
        if (this.state.liked) {
            this.context.api.unlikePost(this.props.id);
            this.setState({ liked: false, likes: this.state.likes - 1 });
        } else {
            this.context.api.likePost(this.props.id);
            this.setState({ liked: true, likes: this.state.likes + 1 });
        }
    }
}

ActionLinks.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};

export default withRouter(ActionLinks);
