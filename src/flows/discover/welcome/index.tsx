import * as React from "react";
import Slider from "react-slick";

import Button, { ButtonSize, ButtonVariant } from "../../../components/button";
import Image from "../../../components/image";
import RouteProps from "../../routeProps";

import * as HandBagImage from "./handbags.png";
import * as InfluencerImage from "./influencer.png";
import * as SummerImage from "./summer.png";
import * as WelcomeImage from "./welcome.png";

import "./style.scss";

interface WelcomeProps extends RouteProps {
    loggedIn: boolean;
}

export default function Welcome({ loggedIn, history, location }: WelcomeProps) {
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
        <div className="welcome-carousel">
            <Slider {...settings}>
                {!loggedIn && (
                    <div className="welcome-banner">
                        <Image src={WelcomeImage} />
                        <Button
                            className="slide-1-join"
                            inline
                            rounded
                            variant={ButtonVariant.SECONDARY}
                            size={ButtonSize.WIDE}
                            onClick={() => history.push(`${location.pathname}/login`)}
                        >
                            Join
                        </Button>
                        <Button
                            className="slide-1-learn"
                            inline
                            white
                            rounded
                            variant={ButtonVariant.OUTLINE}
                            size={ButtonSize.WIDE}
                            onClick={() => history.push("/about")}
                        >
                            Learn More
                        </Button>
                    </div>
                )}
                <div className="welcome-banner">
                    <Image src={SummerImage} />
                    <Button
                        className="slide-2-view"
                        inline
                        rounded
                        variant={ButtonVariant.SECONDARY}
                        size={ButtonSize.WIDE}
                        onClick={() => history.push("/discover?tags=summer?sort=latest")}
                    >
                        View Posts
                    </Button>
                    <Button
                        className="slide-2-shop"
                        inline
                        white
                        rounded
                        variant={ButtonVariant.PRIMARY}
                        size={ButtonSize.WIDE}
                        onClick={() => history.push("/shop/discover?categories=Women%27S%20Swimwear?sort=price_asc")}
                    >
                        Shop Now
                    </Button>
                </div>
                <div className="welcome-banner">
                    <Image src={InfluencerImage} />
                    <Button
                        className="slide-3-view"
                        inline
                        rounded
                        variant={ButtonVariant.SECONDARY}
                        size={ButtonSize.WIDE}
                        onClick={() => history.push("/user/kyrzayda_")}
                    >
                        Shop her style
                    </Button>
                </div>
                <div className="welcome-banner">
                    <Image src={HandBagImage} />
                    <Button
                        className="slide-4-shop"
                        inline
                        rounded
                        variant={ButtonVariant.SECONDARY}
                        size={ButtonSize.WIDE}
                        onClick={() => history.push("/shop/category/bags")}
                    >
                        Shop Now
                    </Button>
                </div>
            </Slider>
        </div>
    );
}
