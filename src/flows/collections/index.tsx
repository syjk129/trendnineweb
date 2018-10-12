import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";

import { Featured } from "../../api/models";
import { AppContext } from "../../app";
import Callout from "../../components/callout";
import Icon, { IconVariant } from "../../components/icon";
import Image, { ImageRatioVariant } from "../../components/image";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import { PostType } from "../cms/types";
import FeaturedCard from "../flowComponents/cardView/featuredCard";
import { FeaturedSection } from "../flowComponents/section";
import RouteProps from "../routeProps";

import "./style.scss";

type Props = RouteProps;

interface CollectionsState {
    isLoading: boolean;
    featuredCollection: Featured;
    collections: Array<Featured>;
}

export default class Collections extends React.Component<Props, CollectionsState> {
    static contextTypes: AppContext;

    state: CollectionsState = {
        isLoading: false,
        featuredCollection: null,
        collections: [],
    };

    async componentWillMount() {
        this.setState({ isLoading: true });
        const [
            featured,
            collections,
        ] = await Promise.all([
            this.context.api.getFeaturedPosts(PostType.COLLECTION, "order_by=priority_level"),
            this.context.api.getFeaturedPosts(PostType.COLLECTION, "order_by=latest"),
        ]);
        this.setState({
            featuredCollection: !isMobile ? this._getFeatured(featured) : null,
            collections,
            isLoading: false,
        });
    }

    render() {
        if (this.state.isLoading) {
            return <SpinnerContainer><Spinner/></SpinnerContainer>;
        }

        return (
            <div className="collections">
                {!isMobile && (
                    <div className="featured-collection">
                        <Link to={`/collection/${this.state.featuredCollection.id}`} className="featured-collection-card">
                            <div className="card-image">
                                <Image
                                    ratio={ImageRatioVariant.FEATURED_COVER}
                                    src={this.state.featuredCollection.cover_image && this.state.featuredCollection.cover_image.small_image_url}
                                />
                            </div>
                            <div className="card-details">
                                <div>
                                    <div className="iconed-callout">
                                        <Icon variant={IconVariant.COLLECTION} />
                                        <Callout inline>Look Collection</Callout>
                                    </div>
                                </div>
                                <div className="featured-title-container">
                                    <h2 className="featured-collection-title">{this.state.featuredCollection.title}</h2>
                                    <div className="featured-collection-caption">{this.state.featuredCollection.caption}</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
                <FeaturedSection
                    title="Curated Collections"
                    subtitle="Our favorite posts and products from the influencers"
                >
                    <div className="collections-grid">
                        {this.state.collections.filter(collection => collection.id !== (this.state.featuredCollection ? this.state.featuredCollection.id : null)).map(collection => (
                            <FeaturedCard post={collection} />
                        ))}
                    </div>
                </FeaturedSection>
            </div>
        );
    }

    private _getFeatured = (collections: Array<Featured>) => {
        const featured = collections.filter(collection => collection.priority_level > 0);
        if (featured.length > 0) {
            return featured[0];
        }
        return collections[0];
    }
}

Collections.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
