import * as H from "history";
import { match } from "react-router-dom";

import { FeaturedInfluencer, Person, Post, PostPreview, Posts } from "../../api/models";
import { PostParam } from "../model";

export interface DiscoverProps {
    history: H.History;
    location: any;
    match: match<any>;
    getTrendingPosts(): Array<Post>;
    getFeedPosts(queryString?: string, nextToken?: string): Posts;
    getLatestPosts(queryString?: string, nextToken?: string): Posts;
    getTodaysTrendnines(): Array<FeaturedInfluencer>;
    getFeaturedTrendnines(): Array<Person>;
}

export interface DiscoverState {
    posts: Array<PostPreview>;
    postsNextToken: string;
    trendingPosts: Array<PostPreview>;
    featuredTrendnines: Array<FeaturedInfluencer>;
    recommendedTrendnines: Array<Person>;
    postParam: PostParam;
    isLoading: boolean;
}
