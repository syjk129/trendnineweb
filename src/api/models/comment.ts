import Person from "./person";

export default class Comment {
    id: string;
    author: Person;
    liked: boolean;
    likes: number;
    is_private: boolean;
    created: string;
    modified: string;
    content: string;
    parent_comment_id: string | null;
    parent_post_id: string;
    threaded_comments: Array<Comment>;
}
