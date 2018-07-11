import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

import "./style.scss";

interface ProductTagProps {
    tag: any;
    open?: boolean;
    history: H.History;
    toggleTag(): void;
}

interface ProductTagState {
    open: boolean;
}

class ProductTag extends React.Component<ProductTagProps, ProductTagState> {
    state: ProductTagState = {
        open: this.props.open || false,
    };

    render() {
        const { tag, history, toggleTag } = this.props;

        return (
            <div
                className="product-tag"
                style={tag.style}
                onClick={toggleTag}
            >
                <span className="product-dot" onClick={this._toggleTag}/>
                {this.state.open && (
                    <span
                        className="tag-name"
                        onClick={() => history.push(`/product/${tag.product_id}`)}
                    >
                        {tag.name}
                    </span>
                )}
            </div>
        );
    }

    private _toggleTag = () => {
        this.setState({ open: !this.state.open });
    }
}

export default withRouter(ProductTag);
