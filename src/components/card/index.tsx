import * as React from "react";
import * as H from "history";
import { withRouter } from "react-router-dom";
import TimeAgo from "react-timeago";
import { Post } from "../../api/models";

import CardContainer from "./cardContainer";
import Author from "../../components/author";
import Anchor, {AnchorVariant} from "../../components/anchor";
import Icon from "../../components/icon";
import "./style.scss";

interface CardProps {
    post: Post;
    history: H.History;
}
class Card extends React.Component<CardProps> {
    render() {
        const { post, history } = this.props;
        const anchorVariant = post.liked ? AnchorVariant.PRIMARY : AnchorVariant.SECONDARY;
        const likeText = post.likes === 1 ? "Like" : "Likes";

        return (
            <div className="card">
                <div className="card-cover" onClick={() => history.push(`/post/${post.id}`)}>
                    <img src={post.cover_image.small_image_url} />
                </div>
                <div className="card-content">
                    <p className="title" onClick={() => history.push(`/post/${post.id}`)}>
                        {post.title}
                    </p>
                    <Author author={post.author} />
                    <div className="card-footer">
                        <div className="created">
                            <Icon></Icon>&nbsp;<TimeAgo date={post.created} />
                        </div>
                        <div className="action-btns">
                            <Anchor variant={anchorVariant}><Icon></Icon>&nbsp;{post.likes} {likeText}</Anchor>
                            <Anchor variant={anchorVariant}><Icon></Icon>&nbsp; Wishlist</Anchor>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Card);

export { CardContainer };
