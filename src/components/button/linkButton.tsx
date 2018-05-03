import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

import Icon, { IconVariant } from "../icon";

import { ButtonProps, ButtonVariant } from "./types";

interface LinkButtonProps {
    selected?: boolean;
    url?: string;
    icon?: IconVariant;
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
            icon,
            history,
            className,
            inline,
            children,
            onClick,
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
            <a className={classes} onClick={onClick || (() => history.push(url))}>
                {icon && <Icon variant={icon} />}
                {children}
            </a>
        );
    }
}

export default withRouter(LinkButton);
