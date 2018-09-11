import { PropTypes } from "prop-types";
import * as React from "react";

import { Featured } from "../../api/models";
import { AppContext } from "../../app";
import { PostType } from "../cms/types";
import FeaturedCard from "../flowComponents/cardView/featuredCard";
import { FeaturedSection } from "../flowComponents/section";
import RouteProps from "../routeProps";

import "./style.scss";

type Props = RouteProps;

interface CollectionsState {
    collections: Array<Featured>;
}

export default class Collections extends React.Component<Props, CollectionsState> {
    static contextTypes: AppContext;

    state: CollectionsState = {
        collections: [],
    };

    async componentWillMount() {
        const collections = await this.context.api.getFeaturedPosts(PostType.COLLECTION);
        this.setState({ collections });
    }

    render() {
        return (
            <div className="collections">
                <FeaturedSection
                    title="Curated Collections"
                    subtitle="Our favorite posts and products from the influencers"
                >
                    <div className="collections-grid">
                        {this.state.collections.map(collection => (
                            <FeaturedCard post={collection} />
                        ))}
                    </div>
                </FeaturedSection>
            </div>
        );
    }
}

Collections.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
