import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { withRouter } from "react-router";

import { Person, PostPreview } from "../../api/models";
import { AppContext, AppContextTypes } from "../../app";
import Carousel, { CarouselItem } from "../../components/carousel";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import { PostCard } from "../flowComponents/cardView";
import Featured from "../flowComponents/featured";
import Filter from "../flowComponents/filter";
import { PostRank } from "../flowComponents/ranking";
import { ContentSection } from "../flowComponents/section";

import "./style.scss";

interface TrendingProps {
}

interface TrendingState {
    posts: Array<PostPreview>;
    featuredTrendnines: Array<Person>;
}

export default class Trending extends React.Component<TrendingProps, TrendingState> {
    static contextTypes: AppContext;

    state: TrendingState = {
        posts: [],
        featuredTrendnines: [],
    };

    async componentWillMount() {
        let featuredTrendnines = new Array();
        let posts = new Array();

        try {
            posts = await this.context.api.getLatestPosts();
        } catch (err) {
            console.warn(err);
        }

        try {
            featuredTrendnines = await this.context.api.getFeaturedTrendnines(6);
        } catch (err) {
            console.warn(err);
        }

        this.setState({ posts, featuredTrendnines });
    }

    render() {
        return (
            <div className="trending">
                <Content>
                    <ContentSection title="In the Spotlight">
                        <Carousel>
                            {this.state.featuredTrendnines.slice(0, 10).map(trendnine => (
                                <div className="featured-trendnine">
                                    <CarouselItem
                                        imageUrl={trendnine.profile_small_image_url}
                                        title={`${trendnine.first_name} ${trendnine.last_name}`}
                                        detail={trendnine.introduction || "Hello!"}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </ContentSection>

                    <ContentSection title="In the Spotlight">
                        <PostRank posts={this.state.posts} hideViewMore={true}/>
                        <PostRank posts={this.state.posts} hideViewMore={true}/>
                        <PostRank posts={this.state.posts} hideViewMore={true}/>
                        <PostRank posts={this.state.posts} hideViewMore={true}/>
                    </ContentSection>
                </Content>
            </div>
        );
    }
}

Trending.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
