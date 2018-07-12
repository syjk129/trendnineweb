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

    componentWillMount() {
        this._tagNameRef = React.createRef();
        this._arrowRef = React.createRef();
    }

    render() {
        const { tag, history, toggleTag } = this.props;

        return (
            <div
                className="product-tag"
                style={tag.style}
                onClick={toggleTag}
            >
                <span className="product-dot" onClick={this._toggleTag}/>
                <span
                    className={`tag-name${!this.state.open ? " hidden" : ""}`}
                    ref={this._tagNameRef}
                    onClick={this._onClick}
                >
                    {tag.name}
                </span>
                <div className={`arrow ${!this.state.open ? " hidden" : ""}`} ref={this._arrowRef} />
            </div>
        );
    }

    private _arrowRef: React.RefObject<HTMLDivElement>;
    private _tagNameRef: React.RefObject<HTMLSpanElement>;

    private _onClick = () => {
        this.props.history.push(`/product/${this.props.tag.product_id}`);
        window.open(this.props.tag.product_url);
    }

    private _toggleTag = () => {
        this.setState({ open: !this.state.open }, () => {
            const tagName = this._tagNameRef.current;
            const arrow = this._arrowRef.current;
            if (tagName) {
                tagName.style.left = `-${tagName.getBoundingClientRect().width / 2 + 25}px`;
                tagName.style.bottom = `${tagName.getBoundingClientRect().height / 2}px`;
            }

            if (arrow && tagName) {
                arrow.style.left = "-30px";
            }
        });
    }
}

export default withRouter(ProductTag);
