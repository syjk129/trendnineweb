import * as React from "react";

import Button, { ButtonSize, ButtonVariant } from "../../../../components/button";
import TextArea from "../../../../components/textArea";
import { CommentInputProps } from "./types";

export default function DesktopCommentInput({ comment, placeholder, user, onChange, submitComment }: CommentInputProps) {
    return (
        <div className="comment-input-container">
            {user && user.profile_image_url && <img src={user.profile_image_url} />}
            <div className="comment-input">
                <TextArea
                    rounded
                    value={comment}
                    onChange={onChange}
                    placeholder={placeholder}
                >
                    asd
                </TextArea>
                <Button
                    inline
                    rounded
                    variant={ButtonVariant.OUTLINE}
                    onClick={submitComment}
                >
                    Post
                </Button>
            </div>
        </div>
    );
}
