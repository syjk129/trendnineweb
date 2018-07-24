import * as React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import { PostPreview } from "../../api/models";
import Button from "../../components/button";
import Image from "../../components/image";
import { PostCard } from "../flowComponents/cardView";

import renderCategories from "./categories";
import { getMobileMarketingImage, MarketingImages } from "./images";

interface MobileShopProps {
    popularPosts: Array<PostPreview>;
}

export default class MobileShop extends React.Component<MobileShopProps> {
    render() {
        return (
            <div className="mobile-shop">
                {this._renderMainCarousel()}
                {this._renderHalfContent(
                    getMobileMarketingImage(MarketingImages.HALF1),
                    "Dream Bags",
                    "/shop/category/bags",
                )}
                {this._renderHalfContent(
                    getMobileMarketingImage(MarketingImages.HALF2),
                    "Beach Please",
                    "/shop/discover?tags=Beach",
                )}
                <div className="divider" />
                {this._renderPopularPosts()}
                <div className="divider" />
                {this._renderHalfContent(
                    getMobileMarketingImage(MarketingImages.HALF3),
                    "Pants",
                    "/shop/discover?categories=Women%27S%20Pants",
                )}
                {this._renderHalfContent(
                    getMobileMarketingImage(MarketingImages.HALF4),
                    "Summer Dresses",
                    "/shop/discover?categories=Dresses&tags=Summer",
                )}
                <div className="divider" />
                {this._renderCategories()}
                <div className="divider" />
                {this._renderFullScreenContent()}
            </div>
        );
    }

    private _renderFullScreenContent = () => {
        const fullScreen1 = getMobileMarketingImage(MarketingImages.FULL1);

        return (
            <Link to="/shop/discover" className="full-screen-content">
                <Image
                    src={fullScreen1.originalImage}
                    previewSrc={fullScreen1.smallImage}
                    width={fullScreen1.width}
                    height={fullScreen1.height}
                />
                <div className="shop-main-text">
                    <div className="banner-title">
                        What's New
                    </div>
                    <Button rounded inline white url="/shop/discover">View All</Button>
                </div>
            </Link>
        );
    }

    private _renderCategories = () => {
        const settings = {
            arrows: false,
            dots: true,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 2,
            variableWidth: false,
        };

        return (
            <>
                <div className="shop-category-title">Shop by Category</div>
                <Slider {...settings} className="category-container">
                    {renderCategories()}
                </Slider>
            </>
        );
    }

    private _renderPopularPosts = () => {
        const settings = {
            arrows: false,
            dots: true,
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 2,
            variableWidth: false,
        };

        return (
            <>
                <div className="shop-category-title">Most Popular Looks</div>
                <Slider {...settings} className="popular-post-container">
                    {this.props.popularPosts && this.props.popularPosts.map(post => (
                        <div>
                            <PostCard post={post} gridSize={2} nohover />
                        </div>
                    ))}
                </Slider>
            </>
        );
    }

    private _renderHalfContent = (img, title, url) => {
        return (
            <div className="half-screen-content">
                <Link to={url}>
                    <Image
                        src={img.originalImage}
                        previewSrc={img.smallImage}
                        width={img.width}
                        height={img.height}
                    />
                    <div className="half-screen-title">{title}</div>
                    <Button inline rounded url={url}>Shop Now</Button>
                </Link>
            </div>
        );
    }

    private _renderMainCarousel = () => {
        const settings = {
            arrows: false,
            dots: true,
            infinite: true,
            autoplaySpeed: 4000,
            autoplay: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: false,
        };

        const carousel1Image = getMobileMarketingImage(MarketingImages.CAROUSEL1);
        const carousel2Image = getMobileMarketingImage(MarketingImages.CAROUSEL2);
        const carousel3Image = getMobileMarketingImage(MarketingImages.CAROUSEL3);

        return (
            <Slider {...settings} className="shop-main-carousel">
                <div>
                    <Link to="/" className="shop-main-banner">
                        <Image
                            src={carousel1Image.originalImage}
                            previewSrc={carousel1Image.smallImage}
                            width={carousel1Image.width}
                            height={carousel1Image.height}
                        />
                        <div className="shop-main-text">
                            <div className="banner-title">
                                @alltheprettybirds
                            </div>
                            <div className="banner-detail">
                                From Jamaica to NYC, Tamu illuminates her cultural background through the lenses of a style connoisseur to capture fashion from a different angle.
                            </div>
                            <Button inline white rounded url="/user/alltheprettybirds">Shop Her Style</Button>
                        </div>
                    </Link>
                </div>
                <div>
                    <Link to="/" className="shop-main-banner">
                        <Image
                            src={carousel2Image.originalImage}
                            previewSrc={carousel2Image.smallImage}
                            width={carousel2Image.width}
                            height={carousel2Image.height}
                        />
                        <div className="shop-main-text">
                            <div className="banner-title">
                                Poolside Stories
                            </div>
                            <div className="banner-detail">
                                The hottest suits for your poolside to seaside<br/>pleasure - all influencer approved.
                            </div>
                            <Button inline white rounded url="/shop/discover?categories=Women%27S%20Swimwear">Shop Swimwear</Button>
                        </div>
                    </Link>
                </div>
                <div>
                    <Link to="/" className="shop-main-banner">
                        <Image
                            src={carousel3Image.originalImage}
                            previewSrc={carousel2Image.smallImage}
                            width={carousel3Image.width}
                            height={carousel3Image.height}
                        />
                        <div className="shop-main-text">
                            <div className="banner-title">
                                Summer Skirts
                            </div>
                            <div className="banner-detail">
                                The summer's hottest mini, midi + maxi skirts<br/>under the sun - all influencer approved.
                            </div>
                            <Button inline white rounded url="/shop/discover?categories=Skirts">Shop Skirts</Button>
                        </div>
                    </Link>
                </div>
            </Slider>
        );
    }
}
