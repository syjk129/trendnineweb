import * as React from "react";
import { Link, withRouter } from "react-router-dom";

import { Featured, FeaturedType } from "../../../../api/models";
import Callout from "../../../../components/callout";

import "./style.scss";

interface FeaturedCardProps {
    post: Featured;
}

class FeaturedCard extends React.Component<FeaturedCardProps> {
    render() {
        if (this.props.post.type === FeaturedType.ARTICLE) {
            return (
                <Link to={`/article/${this.props.post.id}`} className="featured-card">
                    <img src={this.props.post.cover_image && this.props.post.cover_image.small_image_url} />
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
                <div className="featured-card">
                    <img src={this.props.post.cover_image && this.props.post.cover_image.small_image_url} />
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
