import { FeaturedInfluencer } from "../models";

export default class FeaturedInfluencerResponse {
    result: Array<FeaturedInfluencer>;
    next_token: string;
}
