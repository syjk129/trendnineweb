import * as React from "react";
import { Link } from "react-router-dom";

import { ButtonProps, ButtonVariant } from "./types";

interface InteractableProps {
    onMouseEnter?(): void;
    onMouseLeave?(): void;
}

interface LinkButtonProps extends InteractableProps {
    selected?: boolean;
    to?: string;
    className?: string;
    inline?: boolean;
    children: React.ReactNode;
    onClick?(): void;
    target?: string;
    href?: string;
}

export default class LinkButton extends React.Component<LinkButtonProps> {
    render() {
        const {
            selected,
            to,
            className,
            inline,
            children,
            onClick,
            onMouseEnter,
            onMouseLeave,
            target,
            href,
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

        const LinkEl = to ? Link : "a";

        return (
            <LinkEl
                className={classes}
                to={to}
                href={href}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                target={target}
            >
                {children}
            </LinkEl>
        );
    }
}
