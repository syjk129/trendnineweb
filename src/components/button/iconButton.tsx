import autobind from "autobind-decorator";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { LinkButton } from ".";
import Icon, { IconMap, IconSize, IconVariant } from "../icon";
import TextContent from "../textContent";

interface IconButtonProps {
    icon: IconVariant;
    size?: IconSize;
    children?: React.ReactNode;
    selected?: boolean;
    url?: string;
    className?: string;
    inline?: boolean;
    onClick?(): void;
}

interface IconButtonState {
    icon: IconVariant;
}

export default class IconButton extends React.Component<IconButtonProps, IconButtonState> {
    state: IconButtonState = {
        icon: this.props.icon,
    };

    render() {
        const {
            size,
            children,
            selected,
            url,
            className,
            inline,
            onClick,
        } = this.props;

        let classes = "icon-button";

        if (className) {
            classes += ` ${className}`;
        }

        return (
            <LinkButton
                inline={inline}
                to={url}
                className={classes}
                onMouseEnter={this._onMouseEnter}
                onMouseLeave={this._onMouseLeave}
                onClick={onClick}
            >
                <Icon
                    variant={this.state.icon}
                    selected={selected}
                    size={size}
                    withHoverStyles
                />
                {children}
            </LinkButton>
        );
    }

    @autobind
    private _onMouseEnter() {
        this.setState({
            icon: IconMap[this.props.icon],
        });
    }

    @autobind
    private _onMouseLeave() {
        this.setState({
            icon: this.props.icon,
        });
    }
}
