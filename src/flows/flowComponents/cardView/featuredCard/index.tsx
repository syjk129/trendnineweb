import * as React from "react";
import { isMobile } from "react-device-detect";
import { Link, withRouter } from "react-router-dom";

import { Featured, FeaturedType } from "../../../../api/models";
import Callout from "../../../../components/callout";
import Icon, { IconVariant } from "../../../../components/icon";
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
        if (!this.props.post) {
            return null;
        }

        if (this.props.post.type === FeaturedType.ARTICLE) {
            return (
                <Link to={`/article/${this.props.post.id}`} className={classes}>
                    {isMobile ? (
                        <Image
                            className="featured-image"
                            square
                            src={this.props.post.cover_image && this.props.post.cover_image.small_image_url}
                        />
                    ) : (
                        <img className="featured-image" src={this.props.post.cover_image && this.props.post.cover_image.small_image_url} />
                    )}
                    <div className="featured-card-banner">
                        <div className="iconed-callout">
                            <Icon variant={IconVariant.EDITORIAL} />
                            <Callout inline>Read & Shop</Callout>
                        </div>
                        <div className="featured-title">
                            <h3>{this.props.post.title}</h3>
                        </div>
                        <div className="featured-caption">{this.props.post.caption}</div>
                    </div>
                </Link>
            );
        } else {
            return (
                <Link to={`/collection/${this.props.post.id}`} className={classes}>
                    {isMobile ? (
                        <Image
                            className="featured-image"
                            square
                            src={this.props.post.cover_image && this.props.post.cover_image.small_image_url}
                        />
                    ) : (
                        <img className="featured-image" src={this.props.post.cover_image && this.props.post.cover_image.small_image_url} />
                    )}
                    <div className="featured-card-banner">
                        <div className="iconed-callout">
                            <Icon variant={IconVariant.COLLECTION} />
                            <Callout inline>Collection</Callout>
                        </div>
                        <div className="featured-title">
                            <h3>{this.props.post.title}</h3>
                        </div>
                        <div className="featured-caption">{this.props.post.caption}</div>
                    </div>
                </Link>
            );
        }
    }
}

export default withRouter(FeaturedCard);
