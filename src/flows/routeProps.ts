import * as H from "history";
import { match } from "react-router-dom";

export default interface RouteProps {
    history: H.History;
    location: any;
    match: match<any>;
}
