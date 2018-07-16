import * as React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

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
    const settings = {
        infinite: true,
        vertical: true,
        dots: false,
        arrows: false,
        autoplaySpeed: 3000,
        autoplay: true,
        draggable: false,
        swipe: false,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="trending-container">
            <Slider {...settings}>
                {trendingPosts.map(post => (
                    <div>
                        <Link to={`/post/${post.id}`}>
                            <div className="trending-post">
                                <Image className="trending-post-image" src={post.cover_image && post.cover_image.thumbnail_image_url} />
                                <div className="trending-post-details">
                                    <div className="trending-header">
                                        Trending Now
                                    </div>
                                    <div className="trending-post-title">
                                        {post.title}
                                    </div>
                                </div>
                                <div className="trending-post-rank">
                                    <span className="rank">{post.rank_change}</span>
                                    {_getRankIcon(post.rank_change)}
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
