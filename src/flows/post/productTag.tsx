import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

import "./style.scss";

interface ProductTagProps {
    tag: any;
    history: H.History;
}

class ProductTag extends React.Component<ProductTagProps> {
    render() {
        const { tag, history } = this.props;

        return (
            <div className="product-tag" style={tag.style} onClick={() => history.push(`/product/${tag.product_id}`)}>
                <span className="product-dot" />
                {tag.name}
            </div>
        );
    }
}

export default withRouter(ProductTag);
