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
            {featuredTrendnines.slice(0, 2).map(trendnine => (
                <Link to={`/user/${trendnine.user.username}`} className="trendnine">
                    <div className="trendnine-image">
                        <Image circle square src={trendnine.user.profile_small_image_url} />
                    </div>
                    <div className="trendnine-details">
                        <div className="name">
                            @{trendnine.user.username}
                        </div>
                        <div className="intro">
                            {trendnine.user.introduction || "Hello!"}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
