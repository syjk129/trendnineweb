import * as React from "react";

import { Person } from "../../api/models";
import Button, { ButtonVariant } from "../../components/button";

import "./style.scss";

interface FeaturedProps {
    featuredTrendnines: Array<Person>;
}

export default class Featured extends React.Component<FeaturedProps> {
    render() {
        return (
            <div className="featured">
                <p className="featured-title">Today's Trendnine</p>
                {this.props.featuredTrendnines.slice(0, 2)
                    .map(trendnine => (
                        <div className="featured-trendnine">
                            <img src={trendnine.profile_image_url} />
                            <div className="trendnine-details">
                                <p className="trendnine-name">
                                    {trendnine.first_name}
                                </p>
                                {trendnine.introduction &&
                                    <p className="trendnine-introduction">
                                        {trendnine.introduction}
                                    </p>
                                }
                            </div>
                        </div>
                    ))}
                <Button variant={ButtonVariant.PRIMARY}>
                    View More
                </Button>
            </div>
        );
    }
}
