import { match } from "react-router-dom";

import { FeaturedInfluencer, Person, Post, PostPreview } from "../../api/models";

export interface DiscoverProps {
    location: any;
    match: match<any>;
    getTrendingPosts(): Array<Post>;
    getFeedPosts(): Array<Post>;
    getLatestPosts(queryString?: string, nextToken?: string): Array<Post>;
    getTodaysTrendnines(): Array<FeaturedInfluencer>;
    getFeaturedTrendnines(): Array<FeaturedInfluencer>;
}

export interface DiscoverState {
    posts: Array<PostPreview>;
    postsNextToken: string;
    trendingPosts: Array<PostPreview>;
    featuredTrendnines: Array<FeaturedInfluencer>;
    recommendedTrendnines: Array<FeaturedInfluencer>;
    keyword: string;
    search: string;
    filter: string;
    sort: string;
    isLoading: boolean;
}
