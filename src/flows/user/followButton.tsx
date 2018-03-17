import * as React from "react";

import Button, { ButtonVariant } from "../../components/button";

interface FollowButtonProps {
    followed: boolean;
    children?: React.ReactNode;
    onClick(): void;
}

export default function FollowButton({ followed, children, onClick }: FollowButtonProps) {
    return (
        <Button variant={followed ? ButtonVariant.PRIMARY : ButtonVariant.OUTLINE} onClick={onClick}>
            {followed ? "Unfollow" : "Follow"}
        </Button>
    );
}
