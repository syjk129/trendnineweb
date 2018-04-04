import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { Person } from "../../api/models";

import "./style.scss";

interface AuthorProps {
    author: Person;
    date?: Date;
    history: H.History;
}

class Author extends React.Component<AuthorProps> {
    render() {
        const { author, history } = this.props;
        return (
            <div className="author" onClick={() => history.push(`/user/${author.username}`)}>
                <img src={author.profile_image_url} />
                <span className="author-name">
                    {author.username}
                </span>
            </div>
        );
    }
}

export default withRouter(Author);
