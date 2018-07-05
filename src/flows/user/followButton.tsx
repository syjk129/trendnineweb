import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";

import { AppContext, AppContextTypes } from "../../app";
import Button, { ButtonVariant } from "../../components/button";

import { Person } from "../../api/models";

interface FollowButtonProps {
    user: Person;
    followed: boolean;
}

interface FollowButtonState {
    followed: boolean;
}

export default class FollowButton extends React.Component<FollowButtonProps, FollowButtonState> {
    static contextTypes: AppContext;

    state: FollowButtonState = {
        followed: this.props.followed,
    };

    render() {
        return (
            <Button
                rounded
                variant={this.state.followed ? ButtonVariant.PRIMARY : ButtonVariant.OUTLINE}
                onClick={this._toggleSubscribe}
            >
                {this.state.followed ? "Following" : "Follow"}
            </Button>
        );
    }

    @autobind
    private _toggleSubscribe() {
        if (this.state.followed) {
            this.context.api.unfollowUser(this.props.user.id);
        } else {
            this.context.api.followUser(this.props.user.id);
        }

        this.setState({ followed: !this.state.followed });
    }
}

FollowButton.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
