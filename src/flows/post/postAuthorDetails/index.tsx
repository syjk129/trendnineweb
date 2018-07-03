import * as React from "react";
import { isMobile } from "react-device-detect";
import { withRouter } from "react-router-dom";

import { Person } from "../../../api/models";
import { IconButton, LinkButton } from "../../../components/button";
import { IconSize, IconVariant } from "../../../components/icon";
import RouteProps from "../../routeProps";

import "./style.scss";

interface PostAuthorDetailsProps extends RouteProps {
    author: Person;
    iconSize: IconSize;
    postDate: Date;
    postId: string;
    wishlisted: boolean;
    likes: number;
    liked: boolean;
    toggleLike(): void;
    toggleWishlist(): void;
}

function formatDate(date: Date) {
    return `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`;
}

class PostAuthorDetails extends React.Component<PostAuthorDetailsProps> {

    render() {
        const { author, postId, postDate, toggleLike, toggleWishlist } = this.props;

        let classes = "post-author";
        if (isMobile) {
            classes += " mobile";
        }

        let shareUrl;
        const pathname = window.location.pathname.split("/").filter(path => path !== "");
        if (pathname.length === 2) {
            shareUrl = `${window.location.pathname}/share`;
        } else {
            shareUrl = `/share/post/${postId}`;
        }

        return (
            <div className={classes}>
                <div className="post-author-details">
                    <LinkButton to={`/user/${author.id}`}>
                        <img src={author.profile_image_url} />
                        <span>{author.username}</span>
                    </LinkButton>
                    <span className="separator">|</span>
                    <span>{formatDate(postDate)}</span>
                </div>

                <div className="post-action-btns">
                    <span className="likes">
                        <IconButton
                            icon={IconVariant.LIKE}
                            size={this.props.iconSize}
                            selected={this.props.liked}
                            onClick={toggleLike}
                        >
                        </IconButton>
                        {this.props.likes > 0 && this.props.likes}
                    </span>
                    <IconButton
                        icon={IconVariant.SHARE}
                        size={this.props.iconSize}
                        onClick={() => this.props.history.push(shareUrl)}
                    />
                    <IconButton
                        icon={IconVariant.BOOKMARK}
                        size={this.props.iconSize}
                        selected={this.props.wishlisted}
                        onClick={toggleWishlist}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(PostAuthorDetails);
