import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { Person } from "../../../api/models";

import "./style.scss";

interface PostAuthorDetailsProps {
    author: Person;
    postDate: Date;
    history: H.History;
}

function formatDate(date: Date) {
    return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
}

class PostAuthorDetails extends React.Component<PostAuthorDetailsProps> {
    render() {
        const { author, postDate, history} = this.props;

        return (
            <div className="post-author-details" onClick={() => history.push(`/user/${author.id}`)}>
                <img src={author.profile_image_url} />
                <span>By {author.username}</span>
                <span className="separator">|</span>
                <span>{formatDate(postDate)}</span>
            </div>
        );
    }
}

export default withRouter(PostAuthorDetails);
