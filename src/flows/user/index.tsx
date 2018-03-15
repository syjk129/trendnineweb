import autobind from "autobind-decorator";
import * as React from "react";
import { match } from "react-router";
import { PropTypes } from "prop-types";

import { Person } from "../../api/models";
import { AppContext } from "../../app";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";

interface UserProps {
    match: match<any>;
}

interface UserState {
    profile: any;
}

export default class User extends React.Component<UserProps, UserState> {
    static contextTypes: AppContext;

    async componentWillMount() {
        this._userId = this.props.match.params.userId;

        const [
            profile,
        ] = await Promise.all([
            this.context.api.getInfluencer(this._userId),
        ]);

        this.setState({ profile });
    }

    render() {
        return (
            <div className="user">
                <Sidebar>
                    {this.state.profile && (
                        <p>{this.state.profile.user.username}</p>
                    )}
                </Sidebar>
                <Content>
                </Content>
            </div>
        );
    }

    private _userId: string;
}

User.contextTypes = {
    api: PropTypes.any,
};
