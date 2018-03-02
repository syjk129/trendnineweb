import autobind from "autobind-decorator";
import * as React from "react";

import Button, { ButtonVariant } from "../../../components/button";
import TextArea from "../../../components/textArea";

import "./style.scss";

interface CommentsProps {
    comments: Array<Comment>;
    repliesEnabled?: boolean;
    submitComment(): void;
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
                <img src="https://trendnine-dev-bucket.s3.amazonaws.com/images/2017/11/304ed0c3c53646f29545176fdbc24b4b.jpg" />
                <div className="comment-input">
                    <TextArea value={this.state.comment} onChange={this._updateComment} placeholder="Add a comment">
                        asd
                    </TextArea>
                    <Button variant={ButtonVariant.OUTLINE} inline>Post</Button>
                </div>
            </div>
        );
    }

    @autobind
    private _updateComment(comment: string) {
        this.setState({ comment });
    }
}
