import autobind from "autobind-decorator";
import * as React from "react";
import TimeAgo from "react-timeago";

import { PostPreview } from "../../../api/models";
import Author from "../../../components/author";
import { LinkButton } from "../../../components/button";
import {ButtonVariant} from "../../../components/button/types";
import Card from "../../../components/card";
import Carousel, { CarouselItem } from "../../../components/carousel";
import Icon, { IconVariant} from "../../../components/icon";
import ActionLinks, {ActionLinksVariant} from "../../flowComponents/actions";

import "./style.scss";

interface PostCardProps {
    post: PostPreview;
}

export default class PostCard extends React.Component<PostCardProps> {

    render() {
        const { post } = this.props;

        const hoverItem = (
            <div className="card-hover">
                {post.products.map(product => (
                    <div className="post-card-hover-item">
                        <LinkButton className="post-card-hover-btn" url={`/product/${product.id}`} variant={ButtonVariant.SECONDARY}>
                            <img className="post-card-hover-image" src={product.image.small_image_url} />
                            <div className="post-card-hover-content">
                                <p className="post-card-hover-name">
                                    {product.brand.name}
                                </p>
                                <p className="post-card-hover-title">
                                    {product.title}
                                </p>
                                <p className="post-card-hover-price">
                                    {`$${product.price}`}
                                </p>
                            </div>
                        </LinkButton>
                        <ActionLinks
                            variant={ActionLinksVariant.PRODUCT}
                            id={product.id}
                            wishlisted={product.wishlisted}
                        />
                    </div>
                ))}
            </div>
        );

        const footerItem = (
            <div>
                <Author author={post.author} />
                <div className="post-card-footer">
                    <div className="created">
                        <Icon variant={IconVariant.TIME}></Icon>&nbsp;<TimeAgo date={post.created} />
                    </div>
                    <ActionLinks
                        variant={ActionLinksVariant.POST}
                        id={post.id}
                        wishlisted={post.wishlisted}
                        likes={post.likes}
                        liked={post.liked}
                    />
                </div>
            </div>
        );

        return (
            <Card
                imageUrl={post.cover_image.small_image_url}
                redirectUrl={`/post/${post.id}`}
                title={post.title}
                hoverItem={post.products.length > 0 && hoverItem}
                footerItem={footerItem}
            />
        );
    }
}
