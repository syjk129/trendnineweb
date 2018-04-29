import * as React from "react";

import { Person } from "../../../api/models";
import Card from "../../../components/card";
import FollowButton from "../../user/followButton";

interface UserCardProps {
    user: any;
    following: boolean;
    toggleFollowing(): void;
}

export default function UserCard({ user, following, toggleFollowing }: UserCardProps) {
    const footerItem = (
        <div>
            <div className="post-card-footer">
                <div>
                    posts
                </div>
                <div>
                    followers
                </div>
                <div>
                    following
                </div>
            </div>
            <div className="post-card-footer">
                <FollowButton
                    followed={following}
                    onClick={toggleFollowing}
                />
            </div>
        </div>
    );
    return (
        <Card
            imageUrl={user.profile_image_url}
            redirectUrl={user.id}
            title={user.username}
            footerItem={footerItem}
        />
    );
}
