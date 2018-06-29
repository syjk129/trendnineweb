import { FeaturedInfluencer, Person, Post, PostPreview } from "../../api/models";
import { FeaturedInfluencerResponse, PostResponse } from "../../api/responses";
import { PostParam } from "../model";
import RouteProps from "../routeProps";

export interface DiscoverProps extends RouteProps {
    getTrendingPosts(): PostResponse;
    getFeedPosts(queryString?: string, nextToken?: string): PostResponse;
    getLatestPosts(queryString?: string, nextToken?: string): PostResponse;
    getTodaysTrendnines(): FeaturedInfluencerResponse;
    getFeaturedTrendnines(): FeaturedInfluencerResponse;
}

export interface DiscoverState {
    posts: Array<PostPreview>;
    nextToken: string | null;
    trendingPosts: Array<PostPreview>;
    featuredTrendnines: Array<FeaturedInfluencer>;
    recommendedTrendnines: Array<FeaturedInfluencer>;
    postParam: PostParam;
    isLoading: boolean;
    loadingNext: boolean;
}
