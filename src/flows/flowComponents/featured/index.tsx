import * as React from "react";

import { FeaturedInfleuncer } from "../../../api/models";
import Button, { ButtonVariant } from "../../../components/button";
import { SidebarSection } from "../section";

import "./style.scss";

interface FeaturedProps {
    featuredTrendnines: Array<FeaturedInfleuncer>;
}

export default class Featured extends React.Component<FeaturedProps> {
    render() {
        return (
            <SidebarSection title="Today's Trendnine">
                {this.props.featuredTrendnines.slice(0, 2)
                    .map(trendnine => (
                        <div className="featured-trendnine">
                            <img src={trendnine.user.profile_image_url} />
                            <div className="trendnine-details">
                                <p className="trendnine-name">
                                    {trendnine.user.first_name}
                                </p>
                                <p className="trendnine-introduction">
                                    {trendnine.user.introduction || "Hello!"}
                                </p>
                            </div>
                        </div>
                    ))}
            </SidebarSection>
        );
    }
}
