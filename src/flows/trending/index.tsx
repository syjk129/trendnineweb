import * as React from "react";
import { withRouter } from "react-router";
import { PropTypes } from "prop-types";
import autobind from "autobind-decorator";

import Filter from "../flowComponents/filter";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import Featured from "../flowComponents/featured";
import { PostCard } from "../flowComponents/cardView";
import { PostRank } from "../flowComponents/ranking";
import { ContentSection } from "../flowComponents/section";
import Carousel, { CarouselItem } from "../../components/carousel";
import { AppContext } from "../../app";
import { Person, PostPreview } from "../../api/models";

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
            featuredTrendnines = await this.context.api.getFeaturedTrendnines();
        } catch (err) {
            console.warn(err);
        }

        this.setState({ posts, featuredTrendnines });
    }

    render() {
        return (
            <div className="trending">
                <Content>
                    <ContentSection title="Today's Trendnine">
                        <Carousel slidesToShow={7}>
                            {this.state.featuredTrendnines.slice(0, 10).map(trendnine => (
                                <div className="featured-trendnine">
                                    <CarouselItem
                                        imageUrl={trendnine.profile_image_url}
                                        title={`${trendnine.first_name} ${trendnine.last_name}`}
                                        detail={trendnine.introduction || "Hello!"}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </ContentSection>

                    <ContentSection title="Today's Trendnine">
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
};
