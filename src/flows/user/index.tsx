import autobind from "autobind-decorator";
import * as React from "react";
import { match } from "react-router";
import { PropTypes } from "prop-types";

import { Person } from "../../api/models";
import { AppContext } from "../../app";
import Content from "../../components/content";
import Image from "../../components/image";
import Sidebar from "../../components/sidebar";

import FollowButton from "./followButton";

interface UserProps {
    match: match<any>;
    followUser(userId: string): void;
}

interface UserState {
    profile: any;
    followed: boolean;
}

export default class User extends React.Component<UserProps, UserState> {
    static contextTypes: AppContext;

    state: UserState = {
        profile: null,
        followed: false,
    };

    async componentWillMount() {
        this._userId = this.props.match.params.userId;

        const [
            profile,
        ] = await Promise.all([
            this.context.api.getInfluencer(this._userId),
        ]);

        this.setState({ profile, followed: profile.followed });
    }

    render() {
        const user = this.state.profile ? this.state.profile.user : null;

        return (
            <div className="user">
                <Sidebar>
                    {user && (
                        <div>
                            <p>{user.username}</p>
                            <Image
                                className="user-image"
                                src={user.profile_image_url}
                                circle
                            />
                            <p>{user.introduction}</p>
                            <FollowButton
                                followed={this.state.followed}
                                onClick={this._toggleSubscribe}
                            />
                        </div>
                    )}
                </Sidebar>
                <Content>
                </Content>
            </div>
        );
    }

    private _userId: string;

    @autobind
    private _toggleSubscribe() {
        if (this.state.followed) {
            this.context.api.unfollowUser(this._userId);
        } else {
            this.context.api.followUser(this._userId);
        }
        this.setState({ followed: !this.state.followed });
    }
}

User.contextTypes = {
    api: PropTypes.any,
};
