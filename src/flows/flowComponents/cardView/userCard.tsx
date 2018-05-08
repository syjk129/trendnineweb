import * as React from "react";

import { Person } from "../../../api/models";
import Card from "../../../components/card";
import FollowButton from "../../user/followButton";

interface UserCardProps {
    user: Person;
    following: boolean;
}

export default function UserCard({ user, following }: UserCardProps) {
    const footerItem = (
        <div>
            <div className="post-card-content">
                <div>
                    { user.blog_post_count } posts
                </div>
                <div>
                    { user.follower_count } followers
                </div>
                <div>
                    { user.following_count } following
                </div>
            </div>
            <div className="post-card-footer">
                <FollowButton
                    user={ user }
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
            singleLineTitle={true}
        />
    );
}
