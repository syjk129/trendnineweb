import * as React from "react";
import { isMobile } from "react-device-detect";

import NavLink from "../../components/navLink";
import { UserContentType } from "./types";

import "./style.scss";

interface UserTabsProps {
    userId: string;
    isSelf: boolean;
    profile: any;
    pathname: string;
    setContent(page: UserContentType): void;
}

export default function UserTabs({ userId, isSelf, profile, pathname, setContent }: UserTabsProps) {
    let classes = "user-nav";
    if (isMobile) {
        classes += " mobile";
    }

    return (
        <div className={classes}>
            {profile && profile.blog_post_count > 0 &&
                <NavLink
                    url={`/user/${userId}/${UserContentType.POST}`}
                    pathname={pathname}
                    selected={pathname === `/user/${userId}`}
                    onClick={() => setContent(UserContentType.POST)}
                >
                    <p>POSTS</p>
                    <p>{profile.blog_post_count}</p>
                </NavLink>
            }
            {profile && profile.product_count > 0 &&
                <NavLink
                    url={`/user/${userId}/${UserContentType.PRODUCT}`}
                    pathname={pathname}
                    onClick={() => setContent(UserContentType.PRODUCT)}
                >
                    <p>PRODUCTS</p>
                    <p>{profile.product_count}</p>
                </NavLink>
            }
            {isSelf &&
                <NavLink
                    url={`/user/${userId}/`}
                    pathname={pathname}
                    selected={pathname === `/user/${userId}` || pathname === `/user/${userId}/bookmarks`}
                    onClick={() => setContent(UserContentType.POST_WISHLIST)}
                >
                    <p>BOOKMARKS</p>
                    <p>&nbsp;</p>
                </NavLink>
            }
            {isSelf &&
                <NavLink
                    url={`/user/${userId}/${UserContentType.PRODUCT_WISHLIST}`}
                    pathname={pathname}
                    onClick={() => setContent(UserContentType.PRODUCT_WISHLIST)}
                >
                    <p>WISHLIST</p>
                    <p>&nbsp;</p>
                </NavLink>
            }
            {/* {!isSelf &&
                <NavLink
                    url={`/user/${userId}/${UserContentType.FOLLOWER}`}
                    pathname={pathname}
                    onClick={() => setContent(UserContentType.FOLLOWER)}
                >
                    <p>FOLLOWERS</p>
                    <p>{profile.follower_count || 0}</p>
                </NavLink>
            } */}
            {isSelf &&
                <NavLink
                    url={`/user/${userId}/${UserContentType.FOLLOWING}`}
                    pathname={pathname}
                    onClick={() => setContent(UserContentType.FOLLOWING)}
                >
                    <p>FOLLOWING</p>
                </NavLink>
            }
            {isSelf &&
                <NavLink
                    url={`/user/${userId}/${UserContentType.SETTINGS}`}
                    pathname={pathname}
                    onClick={() => setContent(UserContentType.SETTINGS)}
                >
                    <p>Settings</p>
                    <p>&nbsp;</p>
                </NavLink>
            }
        </div>
    );
}
