import autobind from "autobind-decorator";
import * as React from "react";

import { Comment } from "../../../api/models";
import Button, { ButtonVariant } from "../../../components/button";
import TextArea from "../../../components/textArea";

import CommentInput from "./commentInput";
import CommentItem from "./commentItem";
import "./style.scss";

interface CommentsProps {
    comments: Array<Comment>;
    repliesEnabled?: boolean;
    likeComment(commentId: string): Promise<void>;
    unlikeComment(commentId: string): Promise<void>;
    submitComment(comment: string, parentCommentId?: string): Promise<void>;
}

interface CommentsState {
    comment: string;
}

export default class Comments extends React.Component<CommentsProps, CommentsState> {
    state: CommentsState = {
        comment: "",
    };

    render() {
        return (
            <div className="comments">
                <CommentInput
                    comment={this.state.comment}
                    placeholder="Write a comment"
                    onChange={this._updateComment}
                    submitComment={this._submitComment}
                />
                {this.props.comments.map((comment: Comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        likeComment={this.props.likeComment}
                        unlikeComment={this.props.unlikeComment}
                        submitReply={this._submitReply}
                    />
                ))}
            </div>
        );
    }

    @autobind
    private _updateComment(comment: string) {
        this.setState({ comment });
    }

    @autobind
    private _submitComment() {
        this.props.submitComment(this.state.comment);
    }

    @autobind
    private _submitReply(comment: string, parentCommentId: string) {
        return this.props.submitComment(comment, parentCommentId);
    }
}
