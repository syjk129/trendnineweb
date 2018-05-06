import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { AppContext, AppContextTypes } from "../../../app";
import { IconButton, LinkButton } from "../../../components/button";
import { IconSizeVariant, IconVariant } from "../../../components/icon";

import "./style.scss";

export enum ActionLinksVariant {
    POST = "blog",
    PRODUCT = "product",
}

interface ActionLinksProps {
    variant: ActionLinksVariant;
    id: string;
    wishlisted: boolean;
    likes?: number;
    liked?: boolean;
    iconSize?: IconSizeVariant;
}

interface ActionLinksState {
    likes: number;
    liked: boolean;
    wishlisted: boolean;
}

export default class ActionLinks extends React.Component<ActionLinksProps, ActionLinksState>  {
    static contextTypes: AppContext;

    state: ActionLinksState = {
        likes: 0,
        liked: false,
        wishlisted: false,
    };

    async componentWillMount() {
        this.setState({
            likes: this.props.likes,
            liked: this.props.liked,
            wishlisted: this.props.wishlisted });
    }

    render() {
        let likeVariant =  this.state.liked ? IconVariant.LIKE_FILLED : IconVariant.LIKE;
        let wishlistVariant = this.state.wishlisted ? IconVariant.WISHLIST_FILLED : IconVariant.WISHLIST;

        return (
            <div className="action-btns">
                {this.props.variant === ActionLinksVariant.POST &&
                    <IconButton
                        icon={IconVariant.LIKE}
                        size={this.props.iconSize}
                        selected={this.state.liked}
                        onClick={this._likeUnlikePost}
                    >
                        {this.state.likes}
                    </IconButton>
                }
                <IconButton
                    icon={IconVariant.WISHLIST}
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
};
