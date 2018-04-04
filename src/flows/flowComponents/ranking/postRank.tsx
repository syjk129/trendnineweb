import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { PostPreview } from "../../../api/models";
import Button, { ButtonVariant } from "../../../components/button";

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
                    <div className="post-rank" onClick={() => history.push(`/post/${post.id}`)}>
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
                            <div className="post-rank-ranking-number">1000</div>
                            <div className="post-rank-ranking-number-icon">--</div>
                        </div>
                    </div>
                ))}
                {hideViewMore &&
                    <Button variant={ButtonVariant.OUTLINE}>
                        View More
                    </Button>
                }
            </div>
        );
    }
}

export default withRouter(PostRank);
