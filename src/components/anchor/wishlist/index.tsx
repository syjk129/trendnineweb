import * as React from "react";
import { PropTypes } from "prop-types";
import autobind from "autobind-decorator";

import Anchor, {AnchorVariant} from "../../anchor";
import Icon from "../../icon";
import { AppContext } from "../../../app";
import { withRouter } from "react-router-dom";

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

    @autobind
    private _toggleWishlist(id, type) {
        this.context.api.toggleWishlist(id, type);
        this.state = {active: !this.state.active};
        console.log(this.state);
    }

    render() {
        const { id, type, wishlisted } = this.props;
        this.state = { active: wishlisted };

        return (
            <Anchor className={this.state.active ? "active" : ""} variant={this.state.active ? AnchorVariant.PRIMARY : AnchorVariant.SECONDARY} onClick={() => this._toggleWishlist(id, type)}>
                <Icon></Icon>&nbsp; Wishlist
            </Anchor>
        );
    }
}

export default withRouter(Wishlist);

Wishlist.contextTypes = {
    api: PropTypes.any,
};
