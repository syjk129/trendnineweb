import * as React from "react";
import TimeAgo from "react-timeago";

import Anchor, { AnchorVariant } from "../../../components/anchor";
import Wishlist, { WishlistType } from "../../../components/anchor/wishlist";
import { PostPreview } from "../../../api/models";
import Author from "../../../components/author";
import Card from "../../../components/card";
import Carousel, { CarouselItem } from "../../../components/carousel";
import Icon, { IconVariant} from "../../../components/icon";

import "./style.scss";

interface PostCardProps {
    post: PostPreview;
}

export default function PostCard({ post }: PostCardProps) {
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
                            title={product.brand}
                            detail={product.title}
                            subdetail={`$${product.price}`}
                        />
                    </div>
                ))}
            </Carousel>
        </div>
    );

    const anchorVariant = post.liked ? AnchorVariant.PRIMARY : AnchorVariant.SECONDARY;
    const likeText = post.likes === 1 ? "Like" : "Likes";

    const footerItem = (
        <div>
            <Author author={post.author} />
            <div className="created">
                <Icon variant={IconVariant.TIME}></Icon>&nbsp;&nbsp;<TimeAgo date={post.created} />
            </div>
            <div className="action-btns">
                <Anchor variant={anchorVariant}><Icon variant={IconVariant.LIKE}></Icon>&nbsp;&nbsp;{post.likes} {likeText}</Anchor>
                <Wishlist id={post.id} type={WishlistType.POST} wishlisted={post.liked}></Wishlist>
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
