import * as React from "react";
import { Link } from "react-router-dom";

import { Featured, FeaturedType, PostPreview, PostTag } from "../../api/models";
import Button, { ButtonVariant } from "../../components/button";
import LinkButton from "../../components/linkButton";
import ArticleCard from "../flowComponents/cardView/articleCard";
import FeaturedCard from "../flowComponents/cardView/featuredCard";
import { LooksCarousel, TagCarousel } from "../flowComponents/carousel";
import { FeaturedSection } from "../flowComponents/section";

interface DesktopHomeProps {
    featured: Array<Featured>;
    articles: Array<Featured>;
    collections: Array<Featured>;
    trendingLooks: Array<PostPreview>;
    tags: Array<PostTag>;
}

export default class DesktopHome extends React.Component<DesktopHomeProps> {
    componentWillMount() {
        this._homeRef = React.createRef();
        this._mainLeftRef = React.createRef();
        this._mainRight1Ref = React.createRef();
        this._mainRight2Ref = React.createRef();
        window.addEventListener("resize", this._setFeaturedSize);
    }

    componentDidMount() {
        this._setFeaturedSize();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this._setFeaturedSize);
    }

    render() {
        return (
            <div className="home" ref={this._homeRef}>
                <div className="main-featured">
                    <div className="main-featured-left">
                        <div className="item" ref={this._mainLeftRef}>
                            {this._renderMainFeaturedLeft(this._getFeaturedAtLevel(1))}
                        </div>
                    </div>
                    <div className="main-featured-right">
                        <div className="item" ref={this._mainRight1Ref}>
                            <FeaturedCard post={this._getFeaturedAtLevel(2)} />
                        </div>
                        <div className="item" ref={this._mainRight2Ref}>
                            <FeaturedCard post={this._getFeaturedAtLevel(3)} />
                        </div>
                    </div>
                </div>
                {/* <div className="welcome-banner">
                    <Image
                        src={this._getFeaturedAtLevel(1).cover_image.small_image_url}
                        previewSrc={this._getFeaturedAtLevel(1).cover_image.thumbnail_image_url}
                        width={1200}
                        height={300}
                    />
                    <div className="welcome-banner-content">
                    </div>
                </div> */}
                <FeaturedSection
                    title="Latest Looks"
                    subtitle="Our latest looks from the influencers"
                    cta={(<LinkButton url="/looks" className="view-all-button">View All</LinkButton>)}
                >
                    <LooksCarousel looks={this.props.trendingLooks} />
                </FeaturedSection>
                <FeaturedSection
                    title="Style & Occasion"
                    subtitle="Discover influencer posts by style and occasion"
                    cta={(<LinkButton url="/looks" className="view-all-button">View All</LinkButton>)}
                >
                    <TagCarousel tags={this.props.tags} />
                </FeaturedSection>
                <FeaturedSection
                    title="Featured Collections"
                    subtitle="Curated gallery of the hottest trends"
                    cta={(<LinkButton url="/collections" className="view-all-button">View All</LinkButton>)}
                >
                    <div className="featured-collections">
                        <FeaturedCard post={this._getFeaturedAtLevel(4)} />
                        <FeaturedCard post={this._getFeaturedAtLevel(5)} />
                        <FeaturedCard post={this._getFeaturedAtLevel(6)} />
                    </div>
                </FeaturedSection>
                <FeaturedSection
                    title="Articles"
                    subtitle="Must-read articles to keep up with Social Media trends"
                >
                    <div className="articles">
                        {this.props.articles.slice(0, 4).map(article => <ArticleCard article={article} />)}
                        {this.props.articles.length > 4 && (
                            <Button url="/editorials" variant={ButtonVariant.OUTLINE}>View All</Button>
                        )}
                    </div>
                </FeaturedSection>
            </div>
        );
    }

    private _homeRef: React.RefObject<HTMLDivElement>;
    private _mainLeftRef: React.RefObject<HTMLDivElement>;
    private _mainRight1Ref: React.RefObject<HTMLDivElement>;
    private _mainRight2Ref: React.RefObject<HTMLDivElement>;

    private _renderMainFeaturedLeft = (featured: Featured) => {
        switch (featured.type) {
            case FeaturedType.ARTICLE:
                return (
                    <Link to={`/article/${featured.id}`} className="main-featured-card-left">
                        <img className="featured-image" src={featured.cover_image.small_image_url} />
                        <div className="main-featured-left-content">
                            <h1>{featured.title}</h1>
                            <div className="main-featured-left-caption">{featured.caption}</div>
                            <div><Button inline url={`/article/${featured.id}`}>Read & Shop</Button></div>
                        </div>
                    </Link>
                );
            case FeaturedType.CTA:
                return (
                    <div className="main-featured-card-left">
                        <img className="featured-image" src={featured.cover_image.small_image_url} />
                        <div className="main-featured-left-content">
                            <h1>{featured.title}</h1>
                            <div className="main-featured-left-caption">{featured.caption}</div>
                            <div><Button href={featured.direct_url} inline>View Collection</Button></div>
                        </div>
                    </div>
                );
        }
    }

    private _setFeaturedSize = () => {
        if (this._mainLeftRef.current && this._mainRight1Ref.current && this._mainRight2Ref.current) {
            const heightRatio = 3;
            const widthRatio = 4;
            const featuredSpacing = 30;
            const screenWidth = this._homeRef.current.getBoundingClientRect().width;

            const smallSize = (screenWidth - featuredSpacing - (widthRatio * featuredSpacing / heightRatio)) / (3 * widthRatio);
            const bigSize = (featuredSpacing / heightRatio) + smallSize * 2;

            this._mainLeftRef.current.style.width = `${bigSize * widthRatio}px`;
            this._mainLeftRef.current.style.height = `${bigSize * heightRatio}px`;
            this._mainRight1Ref.current.style.width = `${smallSize * widthRatio}px`;
            this._mainRight1Ref.current.style.height = `${smallSize * heightRatio}px`;
            this._mainRight2Ref.current.style.width = `${smallSize * widthRatio}px`;
            this._mainRight2Ref.current.style.height = `${smallSize * heightRatio}px`;
        }
    }

    private _getFeaturedAtLevel = (level: number) => {
        return this.props.featured.find(featured => featured.priority_level === level);
    }
}
