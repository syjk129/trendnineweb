import * as React from "react";

import { Featured, FeaturedType, PostPreview, PostTag } from "../../api/models";
import Button, { ButtonVariant, LinkButton } from "../../components/button";
import Image, { ImageRatioVariant } from "../../components/image";
import { ArticleCard, FeaturedCard, LookCard } from "../flowComponents/cardView";
import { CarouselTag } from "../flowComponents/carousel/tagCarousel";
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
        const user = localStorage.getItem("user");

        return (
            <div className="mobile-home">
                <div className="main-featured">
                    {this._renderMainFeatured()}
                </div>
                <div className="featured-articles">
                    {[this._getFeaturedAtLevel(2), this._getFeaturedAtLevel(3)].map(article => (
                        <ArticleCard featured article={article} />
                    ))}
                </div>
                <FeaturedSection
                    title="Latest Looks"
                    subtitle="Our latest looks from the influencers"
                    cta={(<LinkButton url="/looks" className="view-all-button">View All</LinkButton>)}
                >
                    <div className="trending-looks">
                        {this.props.trendingLooks.map(look => <LookCard look={look} />)}
                    </div>
                </FeaturedSection>
                <FeaturedSection
                    title="Style & Occasion"
                    subtitle="Discover Influencer posts by style and occasion"
                >
                    <div className="style-occasion">
                        {this.props.tags.map(tag => <CarouselTag selected={false} tag={tag} />)}
                    </div>
                </FeaturedSection>
                {!user && (
                    <div className="welcome-banner">
                        <Image
                            className="welcome-banner-image"
                            src={this._getFeaturedAtLevel(1).cover_image.small_image_url}
                            previewSrc={this._getFeaturedAtLevel(1).cover_image.thumbnail_image_url}
                            width={375}
                            height={280}
                        />
                        <div className="welcome-banner-content">
                            <h1>Welcome to TrendNine</h1>
                            <div className="welcome-caption">Discover & Shop the looks from fashion influencers</div>
                            <div><Button inline variant={ButtonVariant.OUTLINE} url="/login">Join Now</Button></div>
                        </div>
                    </div>
                )}
                <FeaturedSection
                    title="Featured Collections"
                    subtitle="Curated gallery of the hottest trends"
                    cta={(<LinkButton url="/collections" className="view-all-button">View All</LinkButton>)}
                >
                    {this.props.collections.slice(0, 3).map(collection => (
                        <FeaturedCard className="featured-collection" post={collection} />
                    ))}
                    <Button variant={ButtonVariant.OUTLINE} url="/collections">View All</Button>
                </FeaturedSection>
                <FeaturedSection
                    title="Articles"
                    subtitle="Must-read articles to keep up with Social Media trends"
                >
                    <div className="featured-articles">
                        {this.props.articles.slice(0, 3).map(article => <ArticleCard featured article={article} />)}
                        <Button variant={ButtonVariant.OUTLINE} url="/editorials">View All</Button>
                    </div>
                </FeaturedSection>
            </div>
        );
    }

    private _renderMainFeatured = () => {
        const featured = this._getFeaturedAtLevel(1);

        switch (featured.type) {
            case FeaturedType.ARTICLE:
                return (
                    <>
                        <Image
                            ratio={ImageRatioVariant.FEATURED_COVER}
                            src={this._getFeaturedAtLevel(1).cover_image && this._getFeaturedAtLevel(1).cover_image.small_image_url}
                        />
                        <div className="main-featured-content">
                            <div className="title">{this._getFeaturedAtLevel(1).title}</div>
                            <div className="subtitle">{this._getFeaturedAtLevel(1).caption}</div>
                            <Button inline url={`/article/${featured.id}`}>Read & Shop</Button>
                        </div>
                    </>
                );
            case FeaturedType.CTA:
                return (
                    <>
                        <Image
                            ratio={ImageRatioVariant.FEATURED_COVER}
                            src={this._getFeaturedAtLevel(1).cover_image && this._getFeaturedAtLevel(1).cover_image.small_image_url}
                        />
                        <div className="main-featured-content">
                            <div className="title">{this._getFeaturedAtLevel(1).title}</div>
                            <div className="subtitle">{this._getFeaturedAtLevel(1).caption}</div>
                            <Button inline href={featured.direct_url}>View Collection</Button>
                        </div>
                    </>
                );
        }
    }

    private _getFeaturedAtLevel = (level: number) => {
        return this.props.featured.find(featured => featured.priority_level === level);
    }
}
