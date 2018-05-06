import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { ButtonProps, ButtonVariant } from "./types";

interface InteractableProps {
    onMouseEnter?(): void;
    onMouseLeave?(): void;
}

interface LinkButtonProps extends InteractableProps {
    selected?: boolean;
    url?: string;
    className?: string;
    inline?: boolean;
    children: React.ReactNode;
    history: H.History;
    onClick?(): void;
}

class LinkButton extends React.Component<LinkButtonProps> {
    render() {
        const {
            selected,
            url,
            history,
            className,
            inline,
            children,
            onClick,
            onMouseEnter,
            onMouseLeave,
        } = this.props;

        let classes = "link-button";
        if (className) {
            classes += ` ${className}`;
        }

        if (selected) {
            classes += " selected";
        }

        if (inline) {
            classes += " inline";
        }

        return (
            <a
                className={classes}
                onClick={onClick || (() => history.push(url))}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {children}
            </a>
        );
    }
}

export default withRouter(LinkButton);
