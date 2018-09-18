import * as React from "react";
import { isMobile } from "react-device-detect";
import { Link, withRouter } from "react-router-dom";

import { Featured, FeaturedType } from "../../../../api/models";
import Callout from "../../../../components/callout";
import Image from "../../../../components/image";

import "./style.scss";

interface FeaturedCardProps {
    post: Featured;
    className?: string;
}

class FeaturedCard extends React.Component<FeaturedCardProps> {
    render() {
        let classes = "featured-card";
        if (isMobile) {
            classes += " mobile";
        }

        if (this.props.className) {
            classes += ` ${this.props.className}`;
        }

        if (this.props.post.type === FeaturedType.ARTICLE) {
            return (
                <Link to={`/article/${this.props.post.id}`} className={classes}>
                    {isMobile ? (
                        <Image
                            square
                            src={this.props.post.cover_image && this.props.post.cover_image.small_image_url}
                        />
                    ) : (
                        <img src={this.props.post.cover_image && this.props.post.cover_image.small_image_url} />
                    )}
                    <div className="featured-card-banner">
                        <Callout>Read & Shop</Callout>
                        <div className="featured-title">
                            <h3>{this.props.post.title}</h3>
                        </div>
                        <div className="featured-caption">{this.props.post.caption}</div>
                    </div>
                </Link>
            );
        } else {
            return (
                <div className={classes}>
                    {isMobile ? (
                        <Image
                            square
                            src={this.props.post.cover_image && this.props.post.cover_image.small_image_url}
                        />
                    ) : (
                        <img src={this.props.post.cover_image && this.props.post.cover_image.small_image_url} />
                    )}
                    <div className="featured-card-banner">
                        <Callout>Collection</Callout>
                        <div className="featured-title">
                            <h3>{this.props.post.title}</h3>
                        </div>
                        <div className="featured-caption">{this.props.post.caption}</div>
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(FeaturedCard);
