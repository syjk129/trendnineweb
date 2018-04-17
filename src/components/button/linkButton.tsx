import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { ButtonProps, ButtonVariant } from "./types";

interface LinkButtonProps extends ButtonProps {
    url?: string;
    history: H.History;
}

class LinkButton extends React.Component<LinkButtonProps> {
    render() {
        const { url, history, className, variant, children, onClick } = this.props;

        let classes = "link-button";
        if (className) {
            classes += ` ${className}`;
        }

        switch (variant) {
            case ButtonVariant.SECONDARY:
                classes += " link-button-secondary";
                break;
            case ButtonVariant.PRIMARY:
            default:
                classes += " link-button-primary";
                break;
        }


        return (
            <a className={classes} onClick={onClick || (() => history.push(url))}>
                {children}
            </a>
        );
    }
}

export default withRouter(LinkButton);
