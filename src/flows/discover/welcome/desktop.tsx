import * as React from "react";
import Slider from "react-slick";

import Button, { ButtonSize, ButtonVariant } from "../../../components/button";
import Image from "../../../components/image";
import WelcomeProps from "./types";

import { DiscoverMarketingImages, getDesktopMarketingImage } from "./images";

import "./style.scss";

export default function DesktopWelcome({ loggedIn, history, location }: WelcomeProps) {
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

    const welcomeImage = getDesktopMarketingImage(DiscoverMarketingImages.WELCOME);
    const carousel1Img = getDesktopMarketingImage(DiscoverMarketingImages.CAROUSEL1);
    const carousel2Img = getDesktopMarketingImage(DiscoverMarketingImages.CAROUSEL2);
    const carousel3Img = getDesktopMarketingImage(DiscoverMarketingImages.CAROUSEL3);

    return (
        <div className="welcome-carousel">
            <Slider {...settings}>
                {!loggedIn && (
                    <div className="welcome-banner">
                        <Image
                            src={welcomeImage.originalImage}
                            previewSrc={welcomeImage.smallImage}
                            width={welcomeImage.width}
                            height={welcomeImage.height}
                        />
                        <div className="welcome-banner-content main">
                            <div className="content-title white">
                                Shop the hottest looks<br/>worn by <i>fashion influencers</i>
                            </div>
                            <div className="content-description white">
                                Discover thousands of fashion influencers, shop what they're wearing and<br/>keep up with your favorites to stay in style - right here on TrendNine.
                            </div>
                            <div className="grouped-buttons">
                                <Button
                                    inline
                                    rounded
                                    variant={ButtonVariant.SECONDARY}
                                    size={ButtonSize.WIDE}
                                    url="/login"
                                >
                                    Join
                                </Button>
                                <Button
                                    inline
                                    white
                                    rounded
                                    variant={ButtonVariant.OUTLINE}
                                    size={ButtonSize.WIDE}
                                    url="/about"
                                >
                                    Learn More
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="welcome-banner">
                    <Image
                        src={carousel1Img.originalImage}
                        previewSrc={carousel1Img.smallImage}
                        width={carousel1Img.width}
                        height={carousel1Img.height}
                    />
                    <div className="welcome-banner-content">
                        <div className="left-content white center">
                            <div className="content-title">
                                Summer<br/>Essentials
                            </div>
                            <Button
                                inline
                                rounded
                                variant={ButtonVariant.SECONDARY}
                                size={ButtonSize.WIDE}
                                url="/discover?tags=summer&sort=latest"
                            >
                                View Posts
                            </Button>
                        </div>
                        <div className="right-content center">
                            <div className="content-title black">
                                Elevated<br/>Swimwear
                            </div>
                            <Button
                                inline
                                rounded
                                variant={ButtonVariant.PRIMARY}
                                size={ButtonSize.WIDE}
                                url="/shop/discover?categories=Women%27S%20Swimwear&sort=price_asc"
                            >
                                Shop Now
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="welcome-banner">
                    <Image
                        src={carousel2Img.originalImage}
                        previewSrc={carousel2Img.smallImage}
                        width={carousel2Img.width}
                        height={carousel2Img.height}
                    />
                    <div className="welcome-banner-content left">
                        <div className="content-title white">@kyrzayda</div>
                        <div className="content-description white">
                            New York's It-Girl, Kyrzayda Rodriguez, gives "boho-chic" a risk-taking twist.<br/>She is no stranger to mixing up prints and bringing her creativeness to life.
                        </div>
                        <Button
                            inline
                            rounded
                            variant={ButtonVariant.SECONDARY}
                            size={ButtonSize.WIDE}
                            url="/user/kyrzayda_"
                        >
                            Shop her style
                        </Button>
                    </div>
                </div>
                <div className="welcome-banner">
                    <Image
                        src={carousel3Img.originalImage}
                        previewSrc={carousel3Img.smallImage}
                        width={carousel3Img.width}
                        height={carousel3Img.height}
                    />
                    <div className="welcome-banner-content right">
                        <div className="content-title white">Going Places</div>
                        <div className="content-description white">
                            From Bae-cation to Stay-cation, we've got you covered with<br/>all the vacation wear you'll need this summer.
                        </div>
                        <Button
                            className="slide-4-shop"
                            inline
                            rounded
                            variant={ButtonVariant.SECONDARY}
                            size={ButtonSize.WIDE}
                            url="/shop/discover?sort=latest&tags=vacation"
                        >
                            Shop Now
                        </Button>
                    </div>
                </div>
            </Slider>
        </div>
    );
}
