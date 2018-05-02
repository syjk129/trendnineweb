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

import "./style.scss";

interface PostCardProps {
    post: PostPreview;
    likePost(postId: string): Promise<void>;
    unlikePost(postId: string): Promise<void>;
    toggleWishlist(postId: string, type: string): Promise<void>;
}

interface PostCardState {
    likes: number;
    liked: boolean;
    wishlisted: boolean;
}

export default class PostCard extends React.Component<PostCardProps, PostCardState> {
    state: PostCardState = {
        likes: this.props.post.likes,
        liked: this.props.post.liked,
        wishlisted: this.props.post.wishlisted,
    };

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
                    </div>
                ))}
            </div>
        );

        const likeVariant =  this.state.liked ? IconVariant.LIKE_FILLED : IconVariant.LIKE;
        const wishlistVariant = this.state.wishlisted ? IconVariant.WISHLIST_FILLED : IconVariant.WISHLIST;
        const likeText = this.state.liked ? "Likes" : "Like";

        const footerItem = (
            <div>
                <Author author={post.author} />
                <div className="post-card-footer">
                    <div className="created">
                        <Icon variant={IconVariant.TIME}></Icon>&nbsp;<TimeAgo date={post.created} />
                    </div>
                    <div className="action-btns">
                        <LinkButton
                            icon={likeVariant}
                            onClick={this._likeUnlikePost}
                        >
                            {this.state.likes}
                        </LinkButton>
                        <LinkButton
                            icon={wishlistVariant}
                            onClick={this._toggleWishlist}
                        ></LinkButton>
                    </div>
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

    @autobind
    private _toggleWishlist() {
        try {
            this.props.toggleWishlist(this.props.post.id, "blog");
        } catch (err) {
            throw new Error(err);
        }
        this.setState({ wishlisted: !this.state.wishlisted });
    }

    @autobind
    private _likeUnlikePost() {
        if (this.state.liked) {
            this.props.unlikePost(this.props.post.id);
            this.setState({ liked: false, likes: this.state.likes - 1 });
        } else {
            this.props.likePost(this.props.post.id);
            this.setState({ liked: true, likes: this.state.likes + 1 });
        }
    }
}
