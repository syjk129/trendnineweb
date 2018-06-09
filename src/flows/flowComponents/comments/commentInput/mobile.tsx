import * as React from "react";

import Button, { ButtonSize, ButtonVariant } from "../../../../components/button";
import TextArea from "../../../../components/textArea";
import { CommentInputProps } from "./types";

export default function MobileCommentInput({ comment, placeholder, user, onChange, submitComment }: CommentInputProps) {
    return (
        <div className="mobile-comment-input-container">
            <div className="comment-user">
                {user && <img src={user.profile_image_url} />}
                <TextArea
                    rounded
                    value={comment}
                    onChange={onChange}
                    placeholder={placeholder}
                >
                    asd
                </TextArea>
            </div>
            <Button
                rounded
                variant={ButtonVariant.OUTLINE}
                size={ButtonSize.WIDE}
                onClick={submitComment}
            >
                Post
            </Button>
        </div>
    );
}
