import { PostPreview } from "../models/";

export default class PostResponse {
    result: Array<PostPreview>;
    next_token: string;
}
