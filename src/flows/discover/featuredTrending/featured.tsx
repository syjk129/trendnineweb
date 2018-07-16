import * as React from "react";
import { Link } from "react-router-dom";

import { FeaturedInfluencer } from "../../../api/models";
import Image from "../../../components/image";

import "./style.scss";

interface FeaturedProps {
    featuredTrendnines: Array<FeaturedInfluencer>;
}

export default function Featured({ featuredTrendnines }: FeaturedProps) {
    return (
        <div className="featured-container">
            <Link className="trendnine" to={`/user/${featuredTrendnines[0].user.username}`}>
                <Image className="trendnine-image" square circle src={featuredTrendnines[0].user.profile_thumbnail_image_url} />
                <div className="trendnine-name">
                    <div className="trending-header">In the Spotlight</div>
                    <span>@{featuredTrendnines[0].user.username}</span>
                </div>
            </Link>
            <Link className="trendnine" to={`/user/${featuredTrendnines[1].user.username}`}>
                <Image className="trendnine-image" square circle src={featuredTrendnines[1].user.profile_thumbnail_image_url} />
                <div className="trendnine-name">
                    <div className="trending-header">&nbsp;</div>
                    <span>@{featuredTrendnines[1].user.username}</span>
                </div>
            </Link>
        </div>
    );
}
