import * as React from "react";

import { Person, PostPreview } from "../../api/models";
import Button, { ButtonSize, ButtonVariant } from "../../components/button";
import Image from "../../components/image";

interface FollowInfluencerProps {
    influencer: Person;
    followed: boolean;
    follow(): void;
    getPostsForUser(userId: string, queryString?: string): Promise<Array<PostPreview>>;
}

interface FollowInfluencerState {
    posts: Array<PostPreview>;
}

export default class FollowInfluencer extends React.Component<FollowInfluencerProps, FollowInfluencerState> {
    state: FollowInfluencerState = {
        posts: [],
    };

    async componentWillMount() {
        const posts = await this.props.getPostsForUser(this.props.influencer.id, "page_size=4");
        this.setState({ posts: posts.slice(0, 4) });
    }

    render() {
        const { influencer, follow, followed } = this.props;

        if (this.state.posts.length < 2) {
            return null;
        }

        return (
            <div className="follow-influencer">
                <div className="influencer">
                    <div className="influencer-details">
                        <Image className="influencer-image" src={influencer.profile_image_url} circle />
                        <div className="description">
                            <p className="name">
                                {`${influencer.first_name} ${influencer.last_name}`}
                            </p>
                            <p className="username">
                                @{influencer.username}
                            </p>
                        </div>
                    </div>
                    <div className="button-container">
                        <Button
                            variant={followed ? ButtonVariant.PRIMARY : ButtonVariant.OUTLINE}
                            onClick={follow}
                            size={ButtonSize.SMALL}
                        >
                            {followed ? "Followed" : "Follow"}
                        </Button>
                    </div>
                </div>
                <div className="influencer-content">
                    {this.state.posts.map(post => (
                        <Image className="influencer-post-preview" square src={post.cover_image.small_image_url} />
                    ))}
                </div>
            </div>
        );
    }
}
