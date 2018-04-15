import autobind from "autobind-decorator";
import * as React from "react";

import { Comment } from "../../../api/models";
import Author from "../../../components/author";
import Anchor, { AnchorVariant } from "../../../components/anchor";

import CommentInput from "./commentInput";
import "./style.scss";

interface CommentItemProps {
    comment: Comment;
    likeComment?(commentId: string): Promise<void>;
    unlikeComment?(commentId: string): Promise<void>;
    submitReply?(parentCommentId: string, reply: string): Promise<void>;
}

interface CommentItemState {
    reply: string;
    liked: boolean;
    showReply: boolean;
}

export default class CommentItem extends React.Component<CommentItemProps, CommentItemState> {
    state: CommentItemState = {
        reply: "",
        liked: this.props.comment.liked,
        showReply: false,
    };

    render() {
        return (
            <div className="comment-item">
                <Author author={this.props.comment.author} />
                <p>{this.props.comment.content}</p>
                <div className="comment-item-actions">
                    {this.props.likeComment && (
                        <Anchor onClick={this._likeComment} variant={AnchorVariant.SECONDARY}>
                            {this.state.liked ? "Unlike" : `Like (${this.props.comment.likes})`}
                        </Anchor>
                    )}
                    {this.props.submitReply && this.props.comment.threaded_comments && (
                        <Anchor onClick={this._toggleReply} variant={AnchorVariant.SECONDARY}>
                            {this.props.comment.threaded_comments.length === 0 ? "Reply" : `Reply (${this.props.comment.threaded_comments.length})`}
                        </Anchor>
                    )}
                </div>
                {this.props.submitReply && this.state.showReply && (
                    <div className="comment-reply">
                        <CommentInput
                            comment={this.state.reply}
                            placeholder="Write your reply"
                            onChange={this._onChange}
                            submitComment={this._submitReply}
                        />
                        {this.props.comment.threaded_comments.map(comment => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                likeComment={this.props.likeComment}
                                unlikeComment={this.props.unlikeComment}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    @autobind
    private _onChange(reply: string) {
        this.setState({ reply });
    }

    @autobind
    private _toggleReply() {
        this.setState({ showReply: !this.state.showReply });
    }

    @autobind
    private _submitReply() {
        this.props.submitReply(this.props.comment.id, this.state.reply);
    }

    @autobind
    private async _likeComment() {
        if (this.state.liked) {
            await this.props.unlikeComment(this.props.comment.id);
        } else {
            await this.props.likeComment(this.props.comment.id);
        }

        this.setState({ liked: !this.state.liked });
    }
}
