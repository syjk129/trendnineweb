import autobind from "autobind-decorator";
import * as React from "react";
import TimeAgo from "react-timeago";

import { Comment } from "../../../api/models";
import { IconButton, LinkButton } from "../../../components/button";
import Icon, { IconVariant } from "../../../components/icon";
import formatTime from "../../../util/formatTime";
import Author from "../author";
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
    likes: number;
    showReply: boolean;
}

export default class CommentItem extends React.Component<CommentItemProps, CommentItemState> {
    state: CommentItemState = {
        reply: "",
        likes: this.props.comment.likes,
        liked: this.props.comment.liked,
        showReply: false,
    };

    render() {
        return (
            <div className="comment-item">
                <div className="comment-author-img">
                    {this.props.comment.author && this.props.comment.author.profile_small_image_url ? (
                        <img src={this.props.comment.author.profile_small_image_url} />
                    ) : (
                        <Icon variant={IconVariant.PROFILE} />
                    )}
                </div>
                <div className="comment">
                    <div className="comment-author">
                        <p className="name">
                            {this.props.comment.author.username}
                        </p>
                        <span className="created">
                            {formatTime(this.props.comment.created)}
                        </span>
                    </div>
                    <p className="comment-content">{this.props.comment.content}</p>
                    <div className="comment-item-actions">
                        {this.props.likeComment &&
                            <div className="like-button">
                                <IconButton
                                    className="like"
                                    inline
                                    icon={IconVariant.LIKE}
                                    selected={this.state.liked}
                                    onClick={this._likeComment}
                                />
                                <span className="likes">{this.state.likes > 0 ? this.state.likes : ""}</span>
                            </div>
                        }
                        {this.props.submitReply && this.props.comment.threaded_comments &&
                            <IconButton
                                inline
                                icon={IconVariant.COMMENT}
                                onClick={this._toggleReply}
                            >
                                {this.props.comment.threaded_comments.length === 0 ? "Reply" : `Reply (${this.props.comment.threaded_comments.length})`}
                            </IconButton>
                        }
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
        this.props.submitReply(this.state.reply, this.props.comment.id);
    }

    @autobind
    private async _likeComment() {
        if (this.state.liked) {
            await this.props.unlikeComment(this.props.comment.id);
            this.setState({ liked: false, likes: this.state.likes - 1 });
        } else {
            await this.props.likeComment(this.props.comment.id);
            this.setState({ liked: true, likes: this.state.likes + 1 });
        }
    }
}
