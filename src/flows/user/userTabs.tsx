import * as React from "react";
import { isMobile } from "react-device-detect";

import { Person } from "../../api/models";
import Tab from "../../components/tab";
import { UserContentType } from "./types";

import "./style.scss";

interface UserTabsProps {
    user: Person;
    userId: string;
    isSelf: boolean;
    profile: any;
    pathname: string;
    setContent(page: UserContentType): void;
}

export default function UserTabs({ user, userId, isSelf, profile, pathname, setContent }: UserTabsProps) {
    let classes = "user-nav";
    if (isMobile) {
        classes += " mobile";
    }

    const isInfluencer = user.auth_level === 2;
    const isManager = user.auth_level >= 3;

    return (
        <div className={classes}>
            {profile && profile.blog_post_count > 0 &&
                <Tab
                    label="Looks"
                    selected={pathname.indexOf(UserContentType.POST) !== -1 || pathname === `/user/${userId}`}
                    onSelect={() => setContent(UserContentType.POST)}
                />
            }
            {profile && profile.product_count > 0 &&
                <Tab
                    label="Products"
                    selected={pathname.indexOf(UserContentType.PRODUCT) !== -1}
                    onSelect={() => setContent(UserContentType.PRODUCT)}
                />
            }
            {isSelf &&
                <Tab
                    label="Saved Posts"
                    selected={pathname === `/user/${userId}` || pathname === `/user/${userId}/bookmarks`}
                    onSelect={() => setContent(UserContentType.POST_WISHLIST)}
                />
            }
            {isSelf &&
                <Tab
                    label="Wishlist"
                    selected={pathname.indexOf(UserContentType.PRODUCT_WISHLIST) !== -1}
                    onSelect={() => setContent(UserContentType.PRODUCT_WISHLIST)}
                />
            }
            {isSelf && profile && profile.following_count &&
                <Tab
                    label={`${profile.following_count} Following`}
                    selected={pathname.indexOf(UserContentType.FOLLOWING) !== -1}
                    onSelect={() => setContent(UserContentType.FOLLOWING)}
                />
            }
            {isSelf &&
                <Tab
                    label="Settings"
                    selected={pathname.indexOf(UserContentType.SETTINGS) !== -1}
                    onSelect={() => setContent(UserContentType.SETTINGS)}
                />
            }
            {isSelf && isInfluencer &&
                <Tab
                    label="Analytics"
                    selected={pathname.indexOf(UserContentType.ANALYTICS) !== -1}
                    onSelect={() => setContent(UserContentType.ANALYTICS)}
                />
            }
            {isSelf && (isInfluencer || isManager) && (
                <Tab
                    label="CMS"
                    selected={pathname === "/cms"}
                    onSelect={() => setContent(UserContentType.CMS)}
                />
            )}
        </div>
    );
}
