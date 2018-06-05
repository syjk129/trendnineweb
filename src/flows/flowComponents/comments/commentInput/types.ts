import { Person } from "../../../../api/models";

export interface CommentInputProps {
    comment: string;
    placeholder?: string;
    user: Person;
    onChange(comment: string): void;
    submitComment(): void;
}
