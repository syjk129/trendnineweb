import * as React from "react";

import { LinkButton } from "../../../components/button";
import ActionLinks, { ActionLinksVariant } from "../actions";

import "./style.scss";

interface SidebarSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function SidebarSection({ title, children }: SidebarSectionProps) {
    return (
        <div className="sidebar-section">
            <div className="sidebar-header">
                {title}
            </div>
            {children}
        </div>
    );
}

interface SidebarPostProductListSectionProps {
    title: string;
    items: Array<any>;
}

export class SidebarPostProductListSection extends React.Component<SidebarPostProductListSectionProps> {
    render() {
        return (
            this.props.items.length > 0 && (
                <SidebarSection title={this.props.title}>
                    {this.props.items.map(item => {
                        return item.type === "Product" ? this._renderProduct(item.content) : this._renderPost(item.content);
                    })}
                </SidebarSection>
            )
        );
    }

    private _renderPost(post) {
        return (
            <LinkButton
                className="post-rank"
                to={`/post/${post.id}`}
            >
                <img className="post-rank-img" src={post.cover_image && post.cover_image.thumbnail_image_url} />
                <div className="post-rank-detail">
                    <p className="post-rank-name">
                        Post
                    </p>
                    {post.title &&
                        <p className="post-rank-title">
                            {post.title}
                        </p>
                    }
                </div>
            </LinkButton>
        );
    }
    private _renderProduct(product) {
        return (
            <div className="post-card-hover-item post-rank">
                <LinkButton
                    className="post-card-hover-btn"
                    to={`/product/${product.id}`}
                    onClick={() => window.open(product.url)}
                >
                    <img className="product-rank-img" src={product.image && product.image.thumbnail_image_url} />
                    <div className="post-card-hover-content post-rank-detail">
                        <p className="post-card-hover-name">
                            {product.brand && product.brand.name}
                        </p>
                        <p className="post-card-hover-title">
                            {product.title}
                        </p>
                        <p className="post-card-hover-price">
                            {`$${product.price}`}
                        </p>
                    </div>
                </LinkButton>
                <div className="post-card-hover-footer post-rank-footer">
                    <ActionLinks
                        variant={ActionLinksVariant.PRODUCT}
                        id={product.id}
                        wishlisted={product.wishlisted}
                        hideShare
                    />
                </div>
            </div>
        )
    }
}
