import * as H from "history";
import { match } from "react-router-dom";

import { Person } from "../../api/models";

export interface UserProps {
    history: H.History;
    user: Person;
    match: match<any>;
    location: any;
    followUser(userId: string): void;
}

export enum UserContentType {
    POST = "post",
    PRODUCT = "product",
    FOLLOWER = "follower",
    FOLLOWING = "following",
    POST_WISHLIST = "bookmarks",
    PRODUCT_WISHLIST = "wishlist",
}
