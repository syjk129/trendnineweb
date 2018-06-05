import * as React from "react";

import { Person } from "../../../api/models";
import WithUserSession from "../../../app/withUserSession";
import Button, { ButtonSize, ButtonVariant } from "../../../components/button";
import TextArea from "../../../components/textArea";

interface CommentInputProps {
    comment: string;
    placeholder?: string;
    user: Person;
    onChange(comment: string): void;
    submitComment(): void;
}

function MobileCommentInput({ comment, placeholder, user, onChange, submitComment }: CommentInputProps) {
    return (
        <div className="mobile-comment-input-container">
            <div className="comment-user">
                <img src={user ? user.profile_image_url : ""} />
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
                inline
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

export default WithUserSession(MobileCommentInput);
