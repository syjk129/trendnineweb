import * as React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import { PostPreview } from "../../api/models";
import Button, { ButtonVariant, IconButton } from "../../components/button";
import { IconVariant } from "../../components/icon";
import Image from "../../components/image";
import { PostCard } from "../flowComponents/cardView";
import renderCategories from "./categories";

import * as FullScreen1 from "./images/full-screen-1.png";
import * as Shop1 from "./images/shop-1.png";
import * as Shop2 from "./images/shop-2.png";
import * as Shop3 from "./images/shop-3.png";

import * as Half1 from "./images/half-1.png";
import * as Half2 from "./images/half-2.png";
import * as Half3 from "./images/half-3.png";
import * as Half4 from "./images/half-4.png";

interface DesktopShopProps {
    popularPosts: Array<PostPreview>;
}

export default class DesktopShop extends React.Component<DesktopShopProps> {
    render() {
        return (
            <div className="desktop-shop">
                {this._renderMainCarousel()}
                {this._renderHalfScreenContent(
                    Half1,
                    Half2,
                    "Dream Bags",
                    "Beach Please",
                    "/shop/category/bags",
                    "/shop/discover?tags=Beach",
                )}
                <div className="divider" />
                {this._renderPopularPosts()}
                <div className="divider" />
                {this._renderHalfScreenContent(
                    Half3,
                    Half4,
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
        return (
            <Link to="/shop/discover" className="full-screen-content">
                <Image src={FullScreen1} />
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
                    <Link to={url1}><Image src={img1} /></Link>
                    <div className="half-screen-item-title">{title1}</div>
                    <Button inline rounded url={url1}>Shop Now</Button>
                </div>
                <div className="half-screen-item">
                    <Link to={url2}><Image src={img2} /></Link>
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

        return (
            <div className="shop-main-carousel">
                <Slider {...settings}>
                    <div>
                        <Link to="/user/alltheprettybirds" className="shop-main-banner">
                            <Image src={Shop3} />
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
                            <Image src={Shop2} />
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
                            <Image src={Shop1} />
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
