import * as React from "react";
import { PropTypes } from "prop-types";
import autobind from "autobind-decorator";
import { withRouter } from "react-router-dom";

import Anchor, {AnchorVariant} from "../../anchor";
import Icon from "../../icon";
import { AppContext } from "../../../app";

export enum WishlistType {
    POST = "blog",
    PRODUCT = "product",
}

interface WishlistProps {
    id: string;
    type: WishlistType;
    wishlisted: boolean;
}

interface WishlistState {
    active: boolean;
}

class Wishlist extends React.Component<WishlistProps, WishlistState> {
    static contextTypes: AppContext;

    state: WishlistState = {
        active: this.props.wishlisted,
    };

    render() {
        const { id, type, wishlisted } = this.props;

        return (
            <Anchor
                variant={this.state.active ? AnchorVariant.PRIMARY : AnchorVariant.SECONDARY}
                onClick={this._toggleWishlist}
            >
                <Icon></Icon>&nbsp; Wishlist
            </Anchor>
        );
    }

    @autobind
    private _toggleWishlist() {
        this.context.api.toggleWishlist(this.props.id, this.props.type);
        this.setState({active: !this.state.active});
        console.log(this.state);
    }
}

export default withRouter(Wishlist);

Wishlist.contextTypes = {
    api: PropTypes.any,
};
