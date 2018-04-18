import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

// import { Tag } from "../../../api/models";
import "./style.scss";

interface TagProps {
    tag: any;
    className?: string;
    inline?: boolean;
    history: H.History;
}

class Tag extends React.Component<TagProps> {
    render() {
        const { tag, inline, history, className } = this.props;

        let classes = "tag";

        if (className) {
            classes += ` ${className}`;
        }

        if (inline) {
            classes += " inline-tag";
        }

        return (
            <div className={classes} onClick={() => history.push(`/discover?q=${tag.content}`)}>
                {tag.content}
            </div>
        );
    }
}

export default withRouter(Tag);
