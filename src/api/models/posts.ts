import Post from "./post";
import PostPreview from "./post-preview";

export default class Posts {
    list: Array<PostPreview>;
    nextToken: string;
}
