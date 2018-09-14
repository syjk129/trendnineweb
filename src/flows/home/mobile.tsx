import * as React from "react";

import { Featured, PostPreview, PostTag } from "../../api/models";
import Button, { LinkButton, ButtonVariant } from "../../components/button";
import Image, { ImageRatioVariant } from "../../components/image";
import { ArticleCard, FeaturedCard } from "../flowComponents/cardView";
import { FeaturedSection } from "../flowComponents/section";

interface MobileHomeProps {
    featured: Array<Featured>;
    articles: Array<Featured>;
    collections: Array<Featured>;
    trendingLooks: Array<PostPreview>;
    tags: Array<PostTag>;
}

export default class MobileHome extends React.Component<MobileHomeProps> {
    render() {
        return (
            <div className="mobile-home">
                <div className="main-featured">
                    <Image
                        ratio={ImageRatioVariant.FEATURED_COVER}
                        src={this._getFeaturedAtLevel(1).cover_image.small_image_url}
                    />
                    <div className="main-featured-content">
                        <div className="title">{this._getFeaturedAtLevel(1).title}</div>
                        <div className="subtitle">{this._getFeaturedAtLevel(1).caption}</div>
                        <Button inline url="">Read & Shop</Button>
                    </div>
                </div>
                <div className="featured-articles">
                    {[this._getFeaturedAtLevel(2), this._getFeaturedAtLevel(3)].map(article => (
                        <ArticleCard featured article={article} />
                    ))}
                </div>
                <FeaturedSection
                    title="Featured Collections"
                    subtitle="Curated gallery of the hottest trends"
                    cta={(<LinkButton url="/collections" className="view-all-button">View All</LinkButton>)}
                >
                    {this.props.collections.map(collection => (
                        <FeaturedCard className="featured-collection" post={collection} />
                    ))}
                </FeaturedSection>
                <FeaturedSection
                    title="Articles"
                    subtitle="Must-read articles to keep up with Social Media trends"
                >
                    <div className="featured-articles">
                        {this.props.articles.slice(0, 3).map(article => <ArticleCard featured article={article} />)}
                        <Button variant={ButtonVariant.OUTLINE} url="">View All</Button>
                    </div>
                </FeaturedSection>
            </div>
        );
    }

    private _getFeaturedAtLevel = (level: number) => {
        return this.props.featured.find(featured => featured.priority_level === level);
    }
}
