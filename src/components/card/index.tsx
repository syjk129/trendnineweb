import * as React from "react";
import * as H from "history";
import { withRouter } from "react-router-dom";
import TimeAgo from "react-timeago";

import { Post } from "../../api/models";
import Author from "../../components/author";
import Anchor, { AnchorVariant } from "../../components/anchor";
import Wishlist, { WishlistType } from "../../components/anchor/wishlist";
import Carousel, { CarouselItem } from "../../components/carousel";
import Icon from "../../components/icon";
import Image from "../../components/image";

import CardContainer from "./cardContainer";
import Icon, { IconVariant } from "../../components/icon";
import "./style.scss";

interface CardProps {
    post: Post;
    history: H.History;
}
class Card extends React.Component<CardProps> {
    render() {
        const { post, history } = this.props;
        const anchorVariant = post.liked ? AnchorVariant.PRIMARY : AnchorVariant.SECONDARY;
        const likeText = post.likes === 1 ? "Like" : "Likes";

        return (
            <div className="card">
                {post.products.length > 0 && (
                    <div className="card-hover-details">
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
                                        title={product.brand}
                                        detail={product.title}
                                        subdetail={`$${product.price}`}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                )}
                <Image
                    src={post.cover_image && post.cover_image.small_image_url}
                    onClick={() => history.push(`/post/${post.id}`)}
                    square
                />
                <div className="card-content">
                    <p className="title" onClick={() => history.push(`/post/${post.id}`)}>
                        {post.title}
                    </p>
                    <Author author={post.author} />
                    <div className="card-footer">
                        <div className="created">
                            <Icon variant={IconVariant.TIME}></Icon>&nbsp;&nbsp;<TimeAgo date={post.created} />
                        </div>
                        <div className="action-btns">
                            <Anchor variant={anchorVariant}><Icon variant={IconVariant.LIKE}></Icon>&nbsp;&nbsp;{post.likes} {likeText}</Anchor>
                            <Wishlist id={post.id} type={WishlistType.POST} wishlisted={post.liked}></Wishlist>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Card);

export { CardContainer };
