import * as React from "react";

import Button, { ButtonSize, ButtonVariant } from "../../../../components/button";
import Icon, { IconVariant } from "../../../../components/icon";
import TextArea from "../../../../components/textArea";
import { CommentInputProps } from "./types";

export default function DesktopCommentInput({ comment, placeholder, user, onChange, submitComment }: CommentInputProps) {
    return (
        <div className="comment-input-container">
            <div className="comment-input">
                <TextArea
                    rounded
                    value={comment}
                    onChange={onChange}
                    placeholder={placeholder}
                >
                    asd
                </TextArea>
                <div>
                    <Button
                        inline
                        variant={ButtonVariant.OUTLINE}
                        onClick={submitComment}
                    >
                        Post
                    </Button>
                </div>
            </div>
        </div>
    );
}
