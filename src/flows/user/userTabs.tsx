import * as React from "react";

import NavLink from "../../components/navLink";
import { UserContentType } from "./types";

interface UserTabsProps {
    userId: string;
    isSelf: boolean;
    profile: any;
    pathname: string;
    setContent(page: UserContentType): void;
}

export default function UserTabs({ userId, isSelf, profile, pathname, setContent }: UserTabsProps) {
    return (
        <div className="user-nav">
            <NavLink
                url={`/user/${userId}`}
                pathname={pathname}
                onClick={() => setContent(UserContentType.POST)}
            >
                <p>POSTS</p>
                <p>{profile.blog_post_count}</p>
            </NavLink>
            <NavLink
                url={`/user/${userId}/products`}
                pathname={pathname}
                onClick={() => setContent(UserContentType.PRODUCT)}
            >
                <p>PRODUCTS</p>
                <p>{profile.product_count}</p>
            </NavLink>
            {isSelf &&
                <NavLink
                    url={`/user/${userId}/post-wishlist`}
                    pathname={pathname}
                    onClick={() => setContent(UserContentType.POST_WISHLIST)}
                >
                    <p>WISHLIST (Posts)</p>
                    <p>&nbsp;</p>
                </NavLink>
            }
            {isSelf &&
                <NavLink
                    url={`/user/${userId}/product-wishlist`}
                    pathname={pathname}
                    onClick={() => setContent(UserContentType.PRODUCT_WISHLIST)}
                >
                    <p>WISHLIST (Products)</p>
                    <p>&nbsp;</p>
                </NavLink>
            }
            <NavLink
                url={`/user/${userId}/followers`}
                pathname={pathname}
                onClick={() => setContent(UserContentType.FOLLOWER)}
            >
                <p>FOLLOWERS</p>
                <p>{profile.follower_count}</p>
            </NavLink>
            <NavLink
                url={`/user/${userId}/following`}
                pathname={pathname}
                onClick={() => setContent(UserContentType.FOLLOWING)}
            >
                <p>FOLLOWING</p>
                <p>{profile.following_count}</p>
            </NavLink>
        </div>
    );
}