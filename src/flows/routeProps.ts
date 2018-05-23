import * as H from "history";
import { match } from "react-router-dom";

export default interface DiscoverProps {
    history: H.History;
    location: any;
    match: match<any>;
}
