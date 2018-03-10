import * as React from "react";
import * as H from "history";
import { withRouter } from "react-router-dom";

// import { Tag } from "../../../api/models";
import "./style.scss";

interface TagProps {
    tag: any;
    history: H.History;
}

class Tag extends React.Component<TagProps> {
    render() {
        const { tag, history } = this.props;

        return (
            <span className="tag" onClick={() => history.push(`/tag/${tag.id}`)}>
                {tag.content}
            </span>
        );
    }
}

export default withRouter(Tag);
