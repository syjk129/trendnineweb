import * as React from "react";

import Button, { ButtonVariant } from "../../../components/button";
import TextArea from "../../../components/textArea";

interface CommentInputProps {
    comment: string;
    placeholder?: string;
    onChange(comment: string): void;
    submitComment(): void;
}

export default function CommentInput({ comment, placeholder, onChange, submitComment }: CommentInputProps) {
    return (
        <div className="comment-input-container">
            <img src="https://trendnine-dev-bucket.s3.amazonaws.com/images/2017/11/304ed0c3c53646f29545176fdbc24b4b.jpg" />
            <div className="comment-input">
                <TextArea value={comment} onChange={onChange} placeholder={placeholder}>
                    asd
                </TextArea>
                <Button variant={ButtonVariant.OUTLINE} onClick={submitComment} inline>Post</Button>
            </div>
        </div>
    );
}
