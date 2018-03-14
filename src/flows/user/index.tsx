import autobind from "autobind-decorator";
import * as React from "react";
import { match } from "react-router";
import { PropTypes } from "prop-types";

import Content from "../../components/content";
import Sidebar from "../../components/sidebar";

interface UserProps {
    match: match<any>;
}

interface UserState {}

export default class User extends React.Component<UserProps, UserState> {
    render() {
        return (
            <div className="user">
                <Content>
                </Content>
                <Sidebar>
                </Sidebar>
            </div>
        );
    }
}
