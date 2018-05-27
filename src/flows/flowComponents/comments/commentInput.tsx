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

function CommentInput({ comment, placeholder, user, onChange, submitComment }: CommentInputProps) {
    return (
        <div className="comment-input-container">
            <img src={user ? user.profile_image_url : ""} />
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
                    size={ButtonSize.WIDE}
                    onClick={submitComment}
                >
                    Post
                </Button>
            </div>
        </div>
    );
}

export default WithUserSession(CommentInput);
