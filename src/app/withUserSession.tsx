import * as React from "react";

import { Person } from "../api/models";

type Diff<T extends string, U extends string> = ({ [P in T]: P } &
    { [P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<Extract<keyof T, string>, Extract<K, string>>>;

interface WithUserSessionProvides {
    user: Person;
}

const WithUserSession = <T extends WithUserSessionProvides>(
    WrappedComponent: React.ComponentType<T>,
) => class extends React.Component<Omit<T, keyof WithUserSessionProvides>> {
    render() {
        const rawUser = localStorage.getItem("user");
        let user: Person;
        if (rawUser && rawUser !== "undefined") {
            user = JSON.parse(rawUser);
        }
        return (
            <WrappedComponent
                user={user}
                {...this.props}
            />
        );
    }
};

export default WithUserSession;
