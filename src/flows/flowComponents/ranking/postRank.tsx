import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { PostPreview } from "../../../api/models";
import Button, { ButtonVariant, LinkButton } from "../../../components/button";
import Icon, { IconVariant } from "../../../components/icon";

import "./style.scss";

interface PostRankProps {
    posts: Array<PostPreview>;
    hideViewMore?: boolean;
    history: H.History;
}

class PostRank extends React.Component<PostRankProps> {
    render() {
        const { posts, hideViewMore, history } = this.props;
        return (
            <div>
                {posts.filter(post => post.cover_image != null).slice(0, 5).map(post => (
                    <LinkButton className="post-rank" url={`/post/${post.id}`} variant={ButtonVariant.SECONDARY}>
                        <img src={post.cover_image.small_image_url} />
                        <div className="post-rank-detail">
                            <p className="post-rank-name">
                                {post.author.first_name}
                            </p>
                            {post.title &&
                                <p className="post-rank-title">
                                    {post.title}
                                </p>
                            }
                        </div>
                        <div className="post-rank-ranking">
                            <div className="post-rank-ranking-number">{post.rank_change || 0}</div>
                            <div className="post-rank-ranking-number-icon">
                                {this._getRankIcon(post.rank_change)}
                            </div>
                        </div>
                    </LinkButton>
                ))}
                {hideViewMore &&
                    <Button variant={ButtonVariant.OUTLINE}>
                        View More
                    </Button>
                }
            </div>
        );
    }

    private _getRankIcon(rankChange: number) {
        if (rankChange > 0) {
            return <Icon variant={IconVariant.ARROW_UP}></Icon>;
        } else if (rankChange < 0) {
            return <Icon variant={IconVariant.ARROW_DOWN}></Icon>;
        } else {
            return "---";
        }
    }
}

export default withRouter(PostRank);
