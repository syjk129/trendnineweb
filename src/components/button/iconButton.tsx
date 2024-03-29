import autobind from "autobind-decorator";
import * as React from "react";
import { isMobile } from "react-device-detect";

import { LinkButton } from ".";
import Icon, { IconMap, IconSize, IconVariant } from "../icon";

interface IconButtonProps {
    icon: IconVariant;
    size?: IconSize;
    children?: React.ReactNode;
    selected?: boolean;
    url?: string;
    className?: string;
    inline?: boolean;
    noSwitch?: boolean;
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
            noSwitch,
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
                onMouseEnter={!noSwitch && !isMobile && this._onMouseEnter}
                onMouseLeave={!noSwitch && !isMobile && this._onMouseLeave}
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
