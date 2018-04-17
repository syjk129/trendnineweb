import autobind from "autobind-decorator";
import * as React from "react";
import TimeAgo from "react-timeago";

import { PostPreview } from "../../../api/models";
import Anchor, { AnchorVariant } from "../../../components/anchor";
import Wishlist, { WishlistType } from "../../../components/anchor/wishlist";
import Author from "../../../components/author";
import Card from "../../../components/card";
import Carousel, { CarouselItem } from "../../../components/carousel";
import Icon, { IconVariant} from "../../../components/icon";

import "./style.scss";

interface PostCardProps {
    post: PostPreview;
    likePost(): Promise<void>;
    unlikePost(): Promise<void>;
    toggleWishlist(postId: string, type: string): Promise<void>;
}

interface PostCardState {
    likes: number;
    liked: boolean;
}

export default class PostCard extends React.Component<PostCardProps, PostCardState> {
    state: PostCardState = {
        likes: this.props.post.likes,
        liked: this.props.post.liked,
    };

    render() {
        const { post } = this.props;

        const hoverItem = (
            <div className="card-hover">
                <div className="card-hover-header-container">
                    <span className="card-hover-header">
                        Products in this post
                    </span>
                </div>
                <Carousel>
                    {post.products.map(product => (
                        <div>
                            <CarouselItem
                                imageUrl={product.image.small_image_url}
                                imageClass="post-card-hover-image"
                                large
                                redirectUrl={`/product/${product.id}`}
                                title={product.brand.name}
                                detail={product.title}
                                subdetail={`$${product.price}`}
                            />
                        </div>
                    ))}
                </Carousel>
            </div>
        );

        const anchorVariant = this.state.liked ? AnchorVariant.PRIMARY : AnchorVariant.SECONDARY;
        const likeText = this.state.liked ? "Likes" : "Like";

        const footerItem = (
            <div>
                <Author author={post.author} />
                <div className="post-card-footer">
                    <div className="created">
                        <Icon variant={IconVariant.TIME}></Icon>&nbsp;&nbsp;<TimeAgo date={post.created} />
                    </div>
                    <div className="action-btns">
                        <Anchor
                            variant={anchorVariant}
                            onClick={this._likeUnlikePost}
                        >
                            <Icon variant={IconVariant.LIKE}></Icon>&nbsp;&nbsp;{this.state.likes} {likeText}
                        </Anchor>
                        <Wishlist
                            id={post.id}
                            type={WishlistType.POST}
                            wishlisted={post.wishlisted}
                            onClick={() => this.props.toggleWishlist(post.id, "blog")}
                        />
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
    private _likeUnlikePost() {
        if (this.state.liked) {
            this.props.unlikePost();
            this.setState({ liked: false, likes: this.state.likes - 1 });
        } else {
            this.props.likePost();
            this.setState({ liked: true, likes: this.state.likes + 1 });
        }
    }
}
