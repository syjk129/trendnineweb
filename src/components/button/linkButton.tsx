import * as React from "react";
import { Link, withRouter } from "react-router-dom";

import RouteProps from "../../flows/routeProps";

interface LinkButtonProps extends RouteProps {
    selected?: boolean;
    to?: any;
    showSelected?: boolean;
    newWindowUrl?: string;
    className?: string;
    inline?: boolean;
    children: React.ReactNode;
    onClick?(): void;
    target?: string;
    href?: string;
    onMouseEnter?(): void;
    onMouseLeave?(): void;
}

class LinkButton extends React.Component<LinkButtonProps> {
    render() {
        const {
            selected,
            showSelected,
            to,
            className,
            inline,
            children,
            onMouseEnter,
            onMouseLeave,
            target,
            href,
        } = this.props;

        let classes = "link-button";
        if (className) {
            classes += ` ${className}`;
        }

        if (selected || (showSelected && this.props.location.pathname === to)) {
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
                onClick={this._onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                target={target}
            >
                {children}
            </LinkEl>
        );
    }

    private _onClick = () => {
        if (this.props.onClick) {
            this.props.onClick();
        }
        if (this.props.newWindowUrl) {
            window.open(this.props.newWindowUrl);
        }
    }
}

export default withRouter(LinkButton);
