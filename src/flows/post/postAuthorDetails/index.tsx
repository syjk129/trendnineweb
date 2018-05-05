import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { Person } from "../../../api/models";

import LinkButton from "../../../components/button/linkButton";

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
            <div className="post-author-details">
                <LinkButton onClick={() => history.push(`/user/${author.id}`)}>
                    <img src={author.profile_image_url} />
                    <span>{author.username}</span>
                </LinkButton>
                <span className="separator">|</span>
                <span>{formatDate(postDate)}</span>
            </div>
        );
    }
}

export default withRouter(PostAuthorDetails);
