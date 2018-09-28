import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";

import { Featured, PostPreview, PostTag, PostTagType } from "../../api/models";
import { AppContext } from "../../app";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import { PostType } from "../cms/types";
import RouteProps from "../routeProps";
import DesktopHome from "./desktop";
import MobileHome from "./mobile";

import "./style.scss";

type Props = RouteProps;

interface HomeState {
    featured: Array<Featured>;
    articles: Array<Featured>;
    collections: Array<Featured>;
    trendingLooks: Array<PostPreview>;
    tags: Array<PostTag>;
}

export default class Home extends React.Component<Props, HomeState> {
    static contextTypes: AppContext;

    state: HomeState = {
        featured: null,
        articles: [],
        collections: [],
        trendingLooks: [],
        tags: [],
    };

    async componentWillMount() {
        const [
            posts,
            articles,
            collections,
            trendingLooks,
            styles,
            occasions,
        ] = await Promise.all([
            this.context.api.getFeaturedPosts(),
            this.context.api.getFeaturedPosts(PostType.ARTICLE, "order_by=latest"),
            this.context.api.getFeaturedPosts(PostType.COLLECTION),
            this.context.api.getLatestPosts("order_by=latest&page_size=15"),
            this.context.api.getPostTags(PostTagType.STYLE),
            this.context.api.getPostTags(PostTagType.OCCASION),
        ]);
        const featured = posts.filter(post => post.priority_level > 0);
        this.setState({ featured, articles, collections, trendingLooks: trendingLooks.list, tags: styles.concat(occasions) });
    }

    render() {
        if (!this.state.featured || this.state.featured.length < 4) {
            return (
                <SpinnerContainer><Spinner/></SpinnerContainer>
            );
        }

        return (
            <>
                {isMobile ? (
                    <MobileHome {...this.state} />
                ) : (
                    <DesktopHome {...this.state} />
                )}
            </>
        );
    }
}

Home.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
