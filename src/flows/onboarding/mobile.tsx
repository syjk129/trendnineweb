import * as React from "react";
import { isMobile } from "react-device-detect";

import { FeaturedInfluencer, Pagination, Person, PostPreview } from "../../api/models";
import Button, { ButtonSize, ButtonVariant } from "../../components/button";
import FollowInfluencer from "./followInfluencer";

interface MobileOnboardingProps {
    influencers: Array<FeaturedInfluencer>;
    followed: Set<string>;
    toggleFollowInfluencer(influencer: Person): void;
    unfollowAll(): void;
    close(redirect?: string): void;
    getPostsForUser(userId: string, queryString?: string): Promise<Pagination<PostPreview>>;
}

export default function MobileOnboarding({
    followed,
    influencers,
    toggleFollowInfluencer,
    unfollowAll,
    close,
    getPostsForUser,
}: MobileOnboardingProps) {
    const settings = {
        adaptiveHeight: true,
        arrows: false,
    };

    return (
        <div className="onboarding mobile">
            <p className="welcome">
                Welcome!
            </p>
            <p className="get-started">
                Get started by following featured influencers.
            </p>
            <div className={`onboarding-follow-container${isMobile && " mobile"}`}>
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
                    <Button rounded size={ButtonSize.SMALL} variant={ButtonVariant.OUTLINE} onClick={unfollowAll}>Unfollow All</Button>
                </div>
                <div className="button-container">
                    <Button rounded size={ButtonSize.SMALL} variant={ButtonVariant.OUTLINE} onClick={() => close("/")}>Get Started</Button>
                </div>
            </div>
        </div>
    )
}
