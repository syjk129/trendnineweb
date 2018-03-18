import * as React from "react";

import { Person } from "../../../api/models";
import Card from "../../../components/card";

interface UserCardProps {
    user: any;
}

export default function ProductCard({ user }: UserCardProps) {
    return (
        <Card
            imageUrl={user.profile_image_url}
            redirectUrl={user.id}
            title={user.username}
        />
    );
}
