import * as React from "react";

import { Person } from "../../../api/models";

import "./style.scss";

interface PostAuthorDetailsProps {
    author: Person;
    postDate: Date;
}

function formatDate(date: Date) {
    return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
}

export default function PostAuthorDetails({ author, postDate }: PostAuthorDetailsProps) {
    return (
        <div className="post-author-details">
            <img src={author.profile_image_url} />
            <span>By {author.username}</span>
            <span className="separator">|</span>
            <span>{formatDate(postDate)}</span>
        </div>
    );
}
