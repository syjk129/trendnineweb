import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { FeaturedInfleuncer } from "../../../api/models";
import Button, { ButtonVariant } from "../../../components/button";
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
                        <div className="featured-trendnine" onClick={() => history.push(`/user/${trendnine.user.ussername}`)}>
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

export default withRouter(Featured);
