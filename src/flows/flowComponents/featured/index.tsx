import * as H from "history";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { withRouter } from "react-router-dom";

import { FeaturedInfluencer } from "../../../api/models";
import Button, { ButtonVariant, LinkButton } from "../../../components/button";
import { SidebarSection } from "../section";

import "./style.scss";

interface FeaturedProps {
    featuredTrendnines: Array<FeaturedInfluencer>;
    history: H.History;
}

class Featured extends React.Component<FeaturedProps> {
    render() {
        return (
            <SidebarSection title="In the Spotlight">
                {this.props.featuredTrendnines.slice(0, 2)
                    .map(trendnine => (
                        <LinkButton
                            className={isMobile ? "mobile-featured-trendnine" : "featured-trendnine"}
                            to={`/user/${trendnine.user.username}`}
                        >
                            <div className="trendnine-image">
                                <img src={trendnine.user.profile_small_image_url} />
                            </div>
                            <div className="trendnine-details">
                                <p className="trendnine-name">
                                    @{trendnine.user.username}
                                </p>
                                <p className="trendnine-introduction">
                                    {trendnine.user.introduction || "Hello!"}
                                </p>
                            </div>
                        </LinkButton>
                    ))}
            </SidebarSection>
        );
    }
}

export default withRouter(Featured);
