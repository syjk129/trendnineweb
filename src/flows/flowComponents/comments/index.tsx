import autobind from "autobind-decorator";
import * as React from "react";

import { Comment } from "../../../api/models";
import Button, { ButtonVariant } from "../../../components/button";
import TextArea from "../../../components/textArea";

import CommentItem from "./commentItem";
import "./style.scss";

interface CommentsProps {
    comments: Array<Comment>;
    repliesEnabled?: boolean;
    submitComment(comment: string): void;
}

interface CommentsState {
    comment: string;
    liked: boolean;
}

export default class Comments extends React.Component<CommentsProps, CommentsState> {
    state: CommentsState = {
        comment: "",
        liked: false,
    };

    render() {
        return (
            <div className="comments">
                <div className="comment-input-container">
                    <img src="https://trendnine-dev-bucket.s3.amazonaws.com/images/2017/11/304ed0c3c53646f29545176fdbc24b4b.jpg" />
                    <div className="comment-input">
                        <TextArea value={this.state.comment} onChange={this._updateComment} placeholder="Add a comment">
                            asd
                        </TextArea>
                        <Button variant={ButtonVariant.OUTLINE} onClick={this._submitComment} inline>Post</Button>
                    </div>
                </div>
                {this.props.comments.map((comment: Comment) => (
                    <CommentItem comment={comment} />
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
}
