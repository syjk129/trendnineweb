import * as React from "react";

import { Person, PostPreview } from "../../../api/models";
import Button, { ButtonSize, ButtonVariant } from "../../../components/button";
import Image from "../../../components/image";

interface MobileFollowInfluencerProps {
    influencer: Person;
    followed: boolean;
    posts: Array<PostPreview>;
    toggleFollow(): void;
}

export default function MobileFollowInfluencer({ influencer, followed, posts, toggleFollow }: MobileFollowInfluencerProps) {
    return (
        <div className="follow-influencer mobile">
            <div className="influencer">
                <div className="influencer-details">
                    <Image className="influencer-image" src={influencer.profile_small_image_url} circle />
                    <div className="description">
                        <p className="name">
                            {`${influencer.first_name} ${influencer.last_name}`}
                        </p>
                        <p className="username">
                            @{influencer.username}
                        </p>
                    </div>
                </div>
            </div>
            <div className="influencer-content">
                {posts && posts.map(post => (
                    <Image className="influencer-post-preview" square src={post.cover_image.thumbnail_image_url} />
                ))}
            </div>
            <div className="button-container">
                <Button
                    rounded
                    variant={followed ? ButtonVariant.PRIMARY : ButtonVariant.OUTLINE}
                    onClick={toggleFollow}
                    size={ButtonSize.SMALL}
                >
                    {followed ? "Followed" : "Follow"}
                </Button>
            </div>
        </div>
    );
}

