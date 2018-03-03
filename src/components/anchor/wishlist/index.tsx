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

    render() {
        const { id, type, wishlisted } = this.props;
        this.state = { active: wishlisted };

        return (
            <Anchor
                variant={this.state.active ? AnchorVariant.PRIMARY : AnchorVariant.SECONDARY}
                onClick={() => this._toggleWishlist(id, type)}
            >
                <Icon></Icon>&nbsp; Wishlist
            </Anchor>
        );
    }

    @autobind
    private _toggleWishlist(id, type) {
        this.context.api.toggleWishlist(id, type);
        this.state = {active: !this.state.active};
        console.log(this.state);
    }
}

export default withRouter(Wishlist);

Wishlist.contextTypes = {
    api: PropTypes.any,
};
