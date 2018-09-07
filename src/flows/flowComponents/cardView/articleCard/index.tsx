import * as React from "react";
import { Link, withRouter } from "react-router-dom";

import { Featured } from "../../../../api/models";
import Callout, { CalloutVariant } from "../../../../components/callout";
import Image, { ImageRatioVariant } from "../../../../components/image";
import LinkButton from "../../../../components/linkButton";

import "./style.scss";

interface ArticleCardProps {
    article: Featured;
}

class ArticleCard extends React.Component<ArticleCardProps> {
    render() {
        return (
            <div className="article-card">
                <Link className="article-card-image" to={`/article/${this.props.article.id}`}>
                    <Image
                        ratio={ImageRatioVariant.ARTICLE_COVER}
                        src={this.props.article.cover_image.small_image_url}
                    />
                </Link>
                <div className="article-details">
                    <div>
                        <Callout inline>Read & Shop</Callout>
                        <Callout inline variant={CalloutVariant.MUTED}>Today</Callout>
                    </div>
                    <Link className="article-title-container" to={`/article/${this.props.article.id}`}>
                        <h3 className="article-title">{this.props.article.title}</h3>
                        <div className="article-caption">{this.props.article.caption}</div>
                    </Link>
                    <LinkButton className="article-read" url={`/article/${this.props.article.id}`}>Read the article</LinkButton>
                </div>
            </div>
        );
    }
}

export default withRouter(ArticleCard);
