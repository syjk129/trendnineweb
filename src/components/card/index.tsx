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
                {post.title}
            </div>
        </div>
    );
}

export { CardContainer };
