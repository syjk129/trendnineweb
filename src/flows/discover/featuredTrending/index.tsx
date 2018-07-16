import * as React from "react";

import { FeaturedInfluencer, PostPreview } from "../../../api/models";
import { TabbedSection } from "../../flowComponents/section";
import RouteProps from "../../routeProps";
import Featured from "./featured";
import Trending from "./trending";

import "./style.scss";

interface FeaturedTrendingProps extends RouteProps {
    featuredTrendnines: Array<FeaturedInfluencer>;
    trendingPosts: Array<PostPreview>;
}

interface FeaturedTrendingState {
    selectedTab: FeaturedTrendingSection;
}

enum FeaturedTrendingSection {
    FEATURED = "In the Spotlight",
    TRENDING = "Trending Now",
}

export default class FeaturedTrending extends React.Component<FeaturedTrendingProps, FeaturedTrendingState> {
    state: FeaturedTrendingState = {
        selectedTab: FeaturedTrendingSection.FEATURED,
    };

    componentWillMount() {
        if (!this.props.featuredTrendnines || this.props.featuredTrendnines.length === 0) {
            this.setState({ selectedTab: FeaturedTrendingSection.TRENDING });
        }
    }

    render() {
        const { featuredTrendnines, trendingPosts } = this.props;

        let sections = [];
        if (featuredTrendnines && featuredTrendnines.length > 0) {
            sections.push(FeaturedTrendingSection.FEATURED);
        }
        if (trendingPosts && trendingPosts.length > 0) {
            sections.push(FeaturedTrendingSection.TRENDING);
        }
        if (sections.length === 0) {
            return null;
        }

        return (
            <div className="featured-trending">
                <Featured featuredTrendnines={featuredTrendnines} />
                <Trending trendingPosts={trendingPosts} />
            </div>
        );
    }

    private _onSectionChange = (section: FeaturedTrendingSection) => {
        this.setState({ selectedTab: section });
    }
}
