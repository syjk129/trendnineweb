import * as React from "react";
import { isMobile } from "react-device-detect";

import { PostPreview } from "../../../api/models";
import { LinkButton } from "../../../components/button";
import Card from "../../../components/card";
import { IconSize } from "../../../components/icon";
import formatTime from "../../../util/formatTime";
import ActionLinks, {ActionLinksVariant} from "../actions";
import Author from "../author";

import "./style.scss";

interface PostCardProps {
    post: PostPreview;
    isMobile?: boolean;
    gridSize?: number;
}

export default class PostCard extends React.Component<PostCardProps> {

    render() {
        const { post, gridSize, isMobile } = this.props;

        const hoverItem = (
            <div className="card-hover">
                {post.products && post.products.map(product => (
                    <div className="post-card-hover-item">
                        <LinkButton
                            className="post-card-hover-btn"
                            to={`/product/${product.id}`}
                        >
                            <img className="post-card-hover-image" src={product.image && product.image.thumbnail_image_url} />
                            <div className="post-card-hover-content">
                                <p className="post-card-hover-name">
                                    {product.brand && product.brand.name}
                                </p>
                                <p className="post-card-hover-title">
                                    {product.title}
                                </p>
                            </div>
                        </LinkButton>
                        <div className="post-card-hover-footer">
                            <p className="post-card-hover-price">
                                {`$${product.price}`}
                            </p>
                            <ActionLinks
                                variant={ActionLinksVariant.PRODUCT}
                                id={product.id}
                                wishlisted={product.wishlisted}
                                hideShare
                            />
                        </div>
                    </div>
                ))}
            </div>
        );

        const footerItem = (
            <div>
                <div className="author-date">
                    <Author author={post.author} />
                    {gridSize !== 2 && formatTime(post.created)}
                </div>
                <div className="post-card-footer">
                    <ActionLinks
                        iconSize={isMobile && gridSize !== 2 ? IconSize.LARGE : IconSize.MEDIUM}
                        variant={ActionLinksVariant.POST}
                        id={post.id}
                        wishlisted={post.wishlisted}
                        liked={post.liked}
                        likes={post.likes}
                    />
                </div>
            </div>
        );

        return (
            <Card
                gridSize={gridSize || 1}
                imageUrl={post.cover_image && (isMobile ? post.cover_image.small_image_url : post.cover_image.thumbnail_image_url)}
                redirectUrl={`/post/${post.id}`}
                title={post.title}
                hoverItem={post.products && post.products.length > 0 && hoverItem}
                footerItem={footerItem}
            />
        );
    }
}
