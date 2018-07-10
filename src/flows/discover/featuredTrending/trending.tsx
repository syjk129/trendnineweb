import * as React from "react";
import { Link } from "react-router-dom";

import { PostPreview } from "../../../api/models";
import Icon, { IconSize, IconVariant } from "../../../components/icon";
import Image from "../../../components/image";

import "./style.scss";

interface TrendingProps {
    trendingPosts: Array<PostPreview>;
}

export default function Trending({ trendingPosts }: TrendingProps) {
    const _getRankIcon = (rankChange: number) => {
        if (rankChange > 0) {
            return <Icon size={IconSize.SMALL} variant={IconVariant.ARROW_UP_GREEN}></Icon>;
        } else if (rankChange < 0) {
            return <Icon size={IconSize.SMALL} variant={IconVariant.ARROW_DOWN_RED}></Icon>;
        } else {
            return <Icon size={IconSize.SMALL} variant={IconVariant.ARROW_ZERO}></Icon>;
        }
    };

    return (
        <div className="trending-container">
            {trendingPosts.slice(0, 5).map(post => (
                <Link to={`/post/${post.id}`} className="trending-post">
                    <Image className="trending-post-image" square src={post.cover_image && post.cover_image.thumbnail_image_url} />
                    <div className="trending-post-detail-rank">
                        <div className="trending-post-detail">
                            <div className="title">
                                {post.title}
                            </div>
                        </div>
                        <div className="trending-post-rank">
                            <div className="rank-number">
                                {(post.rank_change > 0 ? post.rank_change : -1 * post.rank_change) || 0}
                            </div>
                            <div className="rank-icon">
                                {_getRankIcon(post.rank_change)}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
