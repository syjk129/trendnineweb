import * as React from "react";

import { Post } from "../../api/models";

import CardContainer from "./cardContainer";
import "./style.scss";

interface CardProps {
    post: Post;
}

export default function Card({ post }: CardProps) {
    return (
        <div className="card">
            <div className="card-cover">
                <img src={post.cover_image.small_image_url} />
            </div>
            <div className="card-content">
                <p className="title">
                    {post.title}
                </p>
                <div className="author">
                    <img src={post.author.profile_image_url} />
                    <span className="author-name">
                        {post.author.username}
                    </span>
                </div>
                <div className="actions">
                </div>
            </div>
        </div>
    );
}

export { CardContainer };
