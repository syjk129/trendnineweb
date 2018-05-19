import * as H from "history";

import { Person } from "../../api/models";

export interface HeaderProps {
    loggedIn: boolean;
    history: H.History;
    location: any;
    user: Person;
}
