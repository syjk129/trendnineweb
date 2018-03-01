import * as React from "react";
import * as H from "history";
import { withRouter } from "react-router-dom";

import { Post } from "../../api/models";

import CardContainer from "./cardContainer";
import "./style.scss";

interface CardProps {
    post: Post;
    history: H.History;
}
class Card extends React.Component<CardProps> {
    render() {
        const { post, history } = this.props;
        return (
            <div className="card" onClick={() => history.push(`/post/${post.id}`)}>
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
}

export default withRouter(Card);

export { CardContainer };