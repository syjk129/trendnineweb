import * as React from "react";

import { Person, PostPreview } from "../../api/models";
import Button, { ButtonSize, ButtonVariant } from "../../components/button";
import FollowInfluencer from "./followInfluencer";

interface DesktopOnboardingProps {
    influencers: Array<Person>;
    followed: Array<string>;
    followInfluencer(influencer: Person): void;
    unfollowAll(): void;
    close(redirect?: string): void;
    getPostsForUser(userId: string, queryString?: string): Promise<Array<PostPreview>>;
}

export default function DesktopOnboarding({
    followInfluencer,
    followed,
    influencers,
    unfollowAll,
    getPostsForUser,
    close,
}: DesktopOnboardingProps) {
    return (
        <div className="desktop-onboarding">
            <p className="welcome">
                Welcome!
            </p>
            <p className="get-started">
                Get started by following featured influencers
            </p>
            <div className="follow-container">
                {influencers.map(influencer => (
                    <FollowInfluencer
                        followed={followed.indexOf(influencer.id) !== -1}
                        influencer={influencer}
                        follow={() => followInfluencer(influencer)}
                        getPostsForUser={getPostsForUser}
                    />
                ))}
            </div>
            <div className="onboarding-actions">
                <div className="button-container">
                    <Button rounded size={ButtonSize.WIDE} variant={ButtonVariant.OUTLINE} onClick={unfollowAll}>Unfollow All</Button>
                </div>
                <div className="button-container">
                    <Button rounded size={ButtonSize.WIDE} variant={ButtonVariant.OUTLINE} onClick={() => close("/")}>Shop Now</Button>
                </div>
            </div>
        </div>
    );
}
