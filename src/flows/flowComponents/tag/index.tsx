import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

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
        const { tag, inline, className } = this.props;

        let classes = "tag";

        if (className) {
            classes += ` ${className}`;
        }

        return (
            <LinkButton
                className={classes}
                to={`/looks?tags=${tag.content}`}
                inline={inline}
            >
                {tag.content}
            </LinkButton>
        );
    }
}

export default withRouter(Tag);
