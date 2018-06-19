import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

// import { Tag } from "../../../api/models";
import { LinkButton } from "../../../components/button";
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

        return (
            <LinkButton
                className={classes}
                to={`/discover?q=${tag.content}`}
                inline={inline}
            >
                {tag.content}
            </LinkButton>
        );
    }
}

export default withRouter(Tag);
