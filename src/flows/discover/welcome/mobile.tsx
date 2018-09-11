import * as React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import Button from "../../../components/button";
import Image from "../../../components/image";
import { DiscoverMarketingImages, getMobileMarketingImage } from "./images";
import WelcomeProps from "./types";

export default function MobileWelcome({ loggedIn }: WelcomeProps) {
    if (loggedIn) {
        return null;
    }

    const settings = {
        arrows: false,
        dots: true,
        infinite: true,
        autoplaySpeed: 8000,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: false,
    };

    const welcomeImage = getMobileMarketingImage(DiscoverMarketingImages.WELCOME);
    const carousel1Image = getMobileMarketingImage(DiscoverMarketingImages.CAROUSEL1);
    const carousel2Image = getMobileMarketingImage(DiscoverMarketingImages.CAROUSEL2);
    const carousel4Image = getMobileMarketingImage(DiscoverMarketingImages.CAROUSEL4);

    return (
        <div className="mobile-welcome">
            <Slider {...settings}>
                <div>
                    <Link to="/about" className="welcome-banner">
                        <Image
                            src={welcomeImage.originalImage}
                            previewSrc={welcomeImage.smallImage}
                            width={welcomeImage.width}
                            height={welcomeImage.height}
                            className="welcome-image"
                        />
                        <div className="welcome-banner-content">
                            <div className="welcome-banner-title">
                                Shop the hottest<br/>looks worn by<br/><i>fashion influencers</i>
                            </div>
                            <Button rounded inline white url="/about">Learn More</Button>
                        </div>
                    </Link>
                </div>
                <div>
                    <Link to="/discover?tags=summer&sort=latest" className="welcome-banner">
                        <Image
                            src={carousel1Image.originalImage}
                            previewSrc={carousel1Image.smallImage}
                            width={carousel1Image.width}
                            height={carousel1Image.height}
                            className="welcome-image"
                        />
                        <div className="welcome-banner-content">
                            <div className="welcome-banner-title">
                                Summer Essentials
                            </div>
                            <Button rounded inline white url="/discover?tags=summer&sort=latest">View Posts</Button>
                        </div>
                    </Link>
                </div>
                <div>
                    <Link to="/shop/discover?categories=Women%27S%20Swimwear&sort=price_asc" className="welcome-banner">
                        <Image
                            src={carousel2Image.originalImage}
                            previewSrc={carousel2Image.smallImage}
                            width={carousel2Image.width}
                            height={carousel2Image.height}
                            className="welcome-image"
                        />
                        <div className="welcome-banner-content">
                            <div className="welcome-banner-title">
                                Elevated<br/>Swimwear
                            </div>
                            <Button rounded inline white url="/shop/discover?categories=Women%27S%20Swimwear&sort=price_asc">Shop Now</Button>
                        </div>
                    </Link>
                </div>
                <div>
                    <Link to="/shop/discover?sort=latest&tags=vacation" className="welcome-banner">
                        <Image
                            src={carousel4Image.originalImage}
                            previewSrc={carousel4Image.smallImage}
                            width={carousel4Image.width}
                            height={carousel4Image.height}
                            className="welcome-image"
                        />
                        <div className="welcome-banner-content">
                            <div className="welcome-banner-title">
                                Going Places
                            </div>
                            <div className="welcome-banner-description">
                                From Bae-cation to Stay-cation, we've got you covered with all the vacation wear you'll need this summer.
                            </div>
                            <Button rounded inline white url="/shop/discover?sort=latest&tags=vacation">Shopw Now</Button>
                        </div>
                    </Link>
                </div>
            </Slider>
        </div>
    );
}
