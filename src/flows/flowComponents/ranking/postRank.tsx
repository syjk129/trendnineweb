import * as H from "history";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { withRouter } from "react-router-dom";

import { PostPreview } from "../../../api/models";
import Button, { ButtonVariant, LinkButton } from "../../../components/button";
import Icon, { IconSize, IconVariant } from "../../../components/icon";

import "./style.scss";

interface PostRankProps {
    posts: Array<PostPreview>;
    hideRanks?: boolean;
    hideName?: boolean;
    hideViewMore?: boolean;
    history: H.History;
}

class PostRank extends React.Component<PostRankProps> {
    render() {
        const { posts, hideRanks, hideName, hideViewMore, history } = this.props;
        return (
            <div>
                {posts && posts.filter(post => post.cover_image != null).slice(0, 5).map(post => (
                    <LinkButton
                        className={isMobile ? "mobile-post-rank" : "post-rank"}
                        to={`/post/${post.id}`}
                    >
                        <img className="post-rank-img" src={post.cover_image && post.cover_image.thumbnail_image_url} />
                        <div className="post-rank-detail">
                            {post.title &&
                                <p className="post-rank-title">
                                    {post.title}
                                </p>
                            }
                        </div>
                        {!hideRanks && (
                            <div className="post-rank-ranking">
                                <div className={`post-rank-ranking-number ${this._getRankChangeClasses(post.rank_change)}`}>
                                    {(post.rank_change > 0 ? post.rank_change : -1 * post.rank_change) || 0}
                                </div>
                                <div className="post-rank-ranking-number-icon">
                                    {this._getRankIcon(post.rank_change)}
                                </div>
                            </div>
                        )}
                    </LinkButton>
                ))}
                {hideViewMore &&
                    <Button rounded variant={ButtonVariant.OUTLINE} onClick={() => history.push("/trending")}>
                        View More
                    </Button>
                }
            </div>
        );
    }

    private _getRankChangeClasses(rankChange: number) {
        if (rankChange > 0) {
            return "positive";
        } else if (rankChange < 0) {
            return "negative";
        }
        return "";
    }

    private _getRankIcon(rankChange: number) {
        if (rankChange > 0) {
            return <Icon size={IconSize.SMALL} variant={IconVariant.ARROW_UP_GREEN}></Icon>;
        } else if (rankChange < 0) {
            return <Icon size={IconSize.SMALL} variant={IconVariant.ARROW_DOWN_RED}></Icon>;
        } else {
            return <Icon size={IconSize.SMALL} variant={IconVariant.ARROW_ZERO}></Icon>;
        }
    }
}

export default withRouter(PostRank);
