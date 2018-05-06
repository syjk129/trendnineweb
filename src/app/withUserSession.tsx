import * as React from "react";

import { Person } from "../api/models";

type Diff<T extends string, U extends string> = ({ [P in T]: P } &
    { [P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

interface WithUserSessionProvides {
    user: Person;
}

const WithUserSession = <T extends WithUserSessionProvides>(
    WrappedComponent: React.ComponentType<T>,
) => class extends React.Component<Omit<T, keyof WithUserSessionProvides>> {
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

export default WithUserSession;
