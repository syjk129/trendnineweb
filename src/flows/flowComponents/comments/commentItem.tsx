import * as React from "React";

import { Comment } from "../../../api/models";
import Author from "../../../components/author";

import "./style.scss";

interface CommentItemProps {
    comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
    return (
        <div className="comment-item">
            <Author author={comment.author} />
            <p>{comment.content}</p>
        </div>
    );
}
