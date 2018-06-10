import autobind from "autobind-decorator";
import * as H from "history";
import * as React from "react";
import TimeAgo from "react-timeago";

import { PostPreview } from "../../../api/models";
import { IconButton, LinkButton } from "../../../components/button";
import {ButtonVariant} from "../../../components/button/types";
import Card from "../../../components/card";
import Carousel, { CarouselItem } from "../../../components/carousel";
import Icon, { IconVariant} from "../../../components/icon";
import ActionLinks, {ActionLinksVariant} from "../../flowComponents/actions";
import Author from "../../flowComponents/author";

import "./style.scss";

interface PostCardProps {
    post: PostPreview;
    gridSize?: number;
    history: H.History;
}

export default class PostCard extends React.Component<PostCardProps> {

    render() {
        const { post, gridSize, history } = this.props;

        const hoverItem = (
            <div className="card-hover">
                {post.products.map(product => (
                    <div className="post-card-hover-item">
                        <LinkButton
                            className="post-card-hover-btn"
                            variant={ButtonVariant.SECONDARY}
                            url={`/product/${product.id}`}
                        >
                            <img className="post-card-hover-image" src={product.image.small_image_url} />
                            <div className="post-card-hover-content">
                                <p className="post-card-hover-name">
                                    {product.brand.name}
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
                            />
                        </div>
                    </div>
                ))}
            </div>
        );

        const footerItem = (
            <div>
                <Author author={post.author} />
                <div className="post-card-footer">
                    <div className="created">
                        <IconButton icon={IconVariant.TIME}>
                            <TimeAgo date={post.created} />
                        </IconButton>
                    </div>
                    <ActionLinks
                        variant={ActionLinksVariant.POST}
                        id={post.id}
                        wishlisted={post.wishlisted}
                        liked={post.liked}
                    />
                </div>
            </div>
        );

        return (
            <Card
                gridSize={gridSize || 1}
                imageUrl={post.cover_image.small_image_url}
                redirectUrl={`/post/${post.id}`}
                title={post.title}
                hoverItem={post.products.length > 0 && hoverItem}
                footerItem={footerItem}
            />
        );
    }
}
