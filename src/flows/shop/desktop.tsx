import * as React from "react";
import FadeIn from "react-lazyload-fadein";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import { PostPreview } from "../../api/models";
import Button, { ButtonVariant, IconButton } from "../../components/button";
import { IconVariant } from "../../components/icon";
import Image from "../../components/image";
import { PostCard } from "../flowComponents/cardView";
import renderCategories from "./categories";
import { getMarketingImage, MarketingImages } from "./images";

interface DesktopShopProps {
    popularPosts: Array<PostPreview>;
}

export default class DesktopShop extends React.Component<DesktopShopProps> {
    render() {
        return (
            <div className="desktop-shop">
                {this._renderMainCarousel()}
                {this._renderHalfScreenContent(
                    getMarketingImage(MarketingImages.HALF1),
                    getMarketingImage(MarketingImages.HALF2),
                    "Dream Bags",
                    "Beach Please",
                    "/shop/category/bags",
                    "/shop/discover?tags=Beach",
                )}
                <div className="divider" />
                {this._renderPopularPosts()}
                <div className="divider" />
                {this._renderHalfScreenContent(
                    getMarketingImage(MarketingImages.HALF3),
                    getMarketingImage(MarketingImages.HALF4),
                    "Pants",
                    "Summer Dresses",
                    "/shop/discover?categories=Women%27S%20Pants",
                    "shop/discover?categories=Dresses&tags=Summer",
                )}
                <div className="divider" />
                {this._renderCategory()}
                <div className="divider" />
                {this._renderFullScreenContent()}
            </div>
        );
    }

    private _renderFullScreenContent = () => {
        const fullScreen1 = getMarketingImage(MarketingImages.FULL1);

        return (
            <Link to="/shop/discover" className="full-screen-content">
                <Image
                    src={fullScreen1.originalImage}
                    previewSrc={fullScreen1.smallImage}
                    width={fullScreen1.width}
                    height={fullScreen1.height}
                />
                <div className="full-screen-item">
                    <div className="full-screen-title">
                        What's New
                    </div>
                    <Button rounded inline white url="/shop/discover">View All</Button>
                </div>
            </Link>
        );
    }

    private _renderCategory = () => {
        const settings = {
            arrows: true,
            prevArrow: <IconButton icon={IconVariant.ARROW_LEFT} />,
            nextArrow: <IconButton icon={IconVariant.ARROW_RIGHT} />,
            infinite: true,
            slidesToShow: 6,
            slidesToScroll: 1,
            variableWidth: false,
            centerMode: true,
            responsive: [{
                breakpoint: 1543,
                settings: {
                    slidesToShow: 6,
                },
            },
            {
                breakpoint: 1300,
                settings: {
                    slidesToShow: 5,
                },
            }],
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
            arrows: true,
            prevArrow: <IconButton icon={IconVariant.ARROW_LEFT} />,
            nextArrow: <IconButton icon={IconVariant.ARROW_RIGHT} />,
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            variableWidth: false,
            centerMode: true,
            responsive: [{
                breakpoint: 1543,
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 1300,
                settings: {
                    slidesToShow: 4,
                },
            }],
        };

        return (
            <>
                <div className="shop-category-title">Most Popular Looks</div>
                <Slider {...settings} className="popular-post-container">
                    {this.props.popularPosts && this.props.popularPosts.map(post => (
                        <div>
                            <PostCard post={post} noHover />
                        </div>
                    ))}
                </Slider>
                <div className="view-all">
                    <Button rounded inline variant={ButtonVariant.OUTLINE} url="/discover?sort=popularity">View All</Button>
                </div>
            </>
        );
    }

    private _renderHalfScreenContent(img1, img2, title1, title2, url1, url2) {
        return (
            <div className="half-screen-content">
                <div className="half-screen-item">
                    <Link to={url1}>
                        <Image
                            src={img1.originalImage}
                            previewSrc={img1.smallImage}
                            width={img1.width}
                            height={img2.height}
                        />
                    </Link>
                    <div className="half-screen-item-title">{title1}</div>
                    <Button inline rounded url={url1}>Shop Now</Button>
                </div>
                <div className="half-screen-item">
                    <Link to={url2}>
                        <Image
                            src={img2.originalImage}
                            previewSrc={img2.smallImage}
                            width={img2.width}
                            height={img2.height}
                        />
                    </Link>
                    <div className="half-screen-item-title">{title2}</div>
                    <Button inline rounded url={url2}>Shop Now</Button>
                </div>
            </div>
        );
    }

    private _renderMainCarousel() {
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
        const carousel1Image = getMarketingImage(MarketingImages.CAROUSEL1);
        const carousel2Image = getMarketingImage(MarketingImages.CAROUSEL2);
        const carousel3Image = getMarketingImage(MarketingImages.CAROUSEL3);

        return (
            <div className="shop-main-carousel">
                <Slider {...settings}>
                    <div>
                        <Link to="/user/alltheprettybirds" className="shop-main-banner">
                            <Image
                                src={carousel1Image.originalImage}
                                previewSrc={carousel1Image.smallImage}
                                width={carousel1Image.width}
                                height={carousel1Image.height}
                            />
                            <div className="shop-main-text center">
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
                        <Link to="shop/discover?categories=Women%27S%20Swimwear" className="shop-main-banner">
                            <Image
                                src={carousel2Image.originalImage}
                                previewSrc={carousel2Image.smallImage}
                                width={carousel2Image.width}
                                height={carousel2Image.height}
                            />
                            <div className="shop-main-text left">
                                <div className="banner-title">
                                    Poolside Stories
                                </div>
                                <div className="banner-detail">
                                    The hottest suits for your poolside to seaside pleasure - all influencer approved.
                                </div>
                                <Button inline white rounded url="/shop/discover?categories=Women%27S%20Swimwear">Shop Swimwear</Button>
                            </div>
                        </Link>
                    </div>
                    <div>
                        <Link to="/shop/discover?categories=Skirts" className="shop-main-banner">
                            <Image
                                src={carousel3Image.originalImage}
                                previewSrc={carousel3Image.smallImage}
                                width={carousel3Image.width}
                                height={carousel3Image.height}
                            />
                            <div className="shop-main-text left dark">
                                <div className="banner-title">
                                    Summer Skirts
                                </div>
                                <div className="banner-detail">
                                    The summer's hottest mini, midi + maxi skirts under the sun - all influencer approved.
                                </div>
                                <Button inline rounded url="/shop/discover?categories=Skirts">Shop Skirts</Button>
                            </div>
                        </Link>
                    </div>
                </Slider>
            </div>
        );
    }
}
