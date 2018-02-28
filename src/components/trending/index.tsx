import * as React from "react";

import { Post } from "../../api/models";
import Button, { ButtonVariant } from "../../components/button";

import "./style.scss";

interface TrendingProps {
    trendingPosts: Array<Post>;
}

export default function Trending({ trendingPosts }: TrendingProps) {
    return (
        <div className="trending">
            <p className="trending-title">Trending Now</p>
            {trendingPosts.slice(0, 5)
                .map(post => (
                    <div className="trending-post">
                        <img src={post.cover_image.small_image_url} />
                        <div className="trending-post-detail">
                            <p className="trending-post-name">
                                {post.author.first_name}
                            </p>
                            {post.title &&
                                <p className="trendnine-introduction">
                                    {post.title}
                                </p>
                            }
                        </div>
                    </div>
                ))}
            <Button variant={ButtonVariant.OUTLINE}>
                View More
            </Button>
        </div>
    );
}
