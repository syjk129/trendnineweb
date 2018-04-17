import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { FeaturedInfleuncer } from "../../../api/models";
import Button, { ButtonVariant, LinkButton } from "../../../components/button";
import { SidebarSection } from "../section";

import "./style.scss";

interface FeaturedProps {
    featuredTrendnines: Array<FeaturedInfleuncer>;
    history: H.History;
}

class Featured extends React.Component<FeaturedProps> {
    render() {
        const { featuredTrendnines, history } = this.props;
        return (
            <SidebarSection title="Today's Trendnine">
                {this.props.featuredTrendnines.slice(0, 2)
                    .map(trendnine => (
                        <LinkButton
                            className="featured-trendnine"
                            url={`/user/${trendnine.user.username}`}
                            variant={ButtonVariant.SECONDARY}
                        >
                            <img src={trendnine.user.profile_image_url} />
                            <div className="trendnine-details">
                                <p className="trendnine-name">
                                    {trendnine.user.first_name}
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
