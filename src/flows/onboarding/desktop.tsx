import * as React from "react";

import { FeaturedInfluencer, Pagination, Person, PostPreview } from "../../api/models";
import Button, { ButtonSize, ButtonVariant } from "../../components/button";
import FollowInfluencer from "./followInfluencer";

interface DesktopOnboardingProps {
    influencers: Array<FeaturedInfluencer>;
    followed: Set<string>;
    toggleFollowInfluencer(influencer: Person): void;
    unfollowAll(): void;
    close(redirect?: string): void;
    getPostsForUser(userId: string, queryString?: string): Promise<Pagination<PostPreview>>;
}

export default function DesktopOnboarding({
    toggleFollowInfluencer,
    followed,
    influencers,
    unfollowAll,
    getPostsForUser,
    close,
}: DesktopOnboardingProps) {
    return (
        <div className="onboarding">
            <p className="welcome">
                Welcome!
            </p>
            <p className="get-started">
                Get started by following featured influencers.
            </p>
            <div className="onboarding-follow-container">
                {influencers.map(influencer => (
                    <FollowInfluencer
                        followed={followed.has(influencer.user.id)}
                        influencer={influencer.user}
                        toggleFollow={() => toggleFollowInfluencer(influencer.user)}
                        getPostsForUser={getPostsForUser}
                    />
                ))}
            </div>
            <div className="onboarding-actions">
                <div className="button-container">
                    <Button rounded size={ButtonSize.WIDE} variant={ButtonVariant.OUTLINE} onClick={unfollowAll}>Unfollow All</Button>
                </div>
                <div className="button-container">
                    <Button rounded size={ButtonSize.WIDE} variant={ButtonVariant.OUTLINE} onClick={() => close("/discover")}>Get Started</Button>
                </div>
            </div>
        </div>
    );
}
