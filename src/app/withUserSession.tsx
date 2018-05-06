import * as React from "react";

import { Person } from "../api/models";

export default function WithUserSession(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props);

            this._user = JSON.parse(localStorage.getItem("user"));
        }

        render() {
            return (
                <WrappedComponent
                    user={this._user}
                    {...this.props}
                />
            );
        }

        private _user: Person;
    };
}
