import * as React from "react";

import { Comment, Person, Post, Product } from "../../api/models";
import Icon, { IconSize, IconVariant } from "../../components/icon";
import Image, { ImageRatioVariant } from "../../components/image";
import ActionLinks, { ActionLinksVariant } from "../flowComponents/actions";
import PostAuthorDetails from "./postAuthorDetails";
import ProductTag from "./productTag";

interface MobilePostProps {
    post: Post;
    comments: Array<Comment>;
    relatedPosts: Array<Post>;
    relatedProducts: Array<Product>;
    featuredTrendnines: Array<Person>;
    likeComment(commentId: string): Promise<void>;
    unlikeComment(commentId: string): Promise<void>;
    submitComment(comment: string, parentCommentId: string): Promise<void>;
}

export default function MobilePost({
    post,
    comments,
    relatedPosts,
    relatedProducts,
    featuredTrendnines,
}: MobilePostProps) {
    return (
        <div className="mobile-post">
            <div className="post-content">
                <Image
                    className="post-cover"
                    src={post.cover_image.original_image_url}
                    ratio={ImageRatioVariant.POST_COVER}
                />
                <p className="post-title">
                    {post.title}
                </p>
                <div className="post-subtitle">
                    <PostAuthorDetails
                        author={post.author}
                        postDate={new Date(post.created)}
                    />
                    <ActionLinks
                        variant={ActionLinksVariant.POST}
                        id={post.id}
                        wishlisted={post.wishlisted}
                        likes={post.likes}
                        liked={post.liked}
                        iconSize={IconSize.MEDIUM}
                    />
                </div>
                <div className="post-details">
                    {/* TODO: Don't use dangerouslySetInnerHTML. Make this safer */}
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
            </div>
        </div>
    );
}
