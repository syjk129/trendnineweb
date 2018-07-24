import * as React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import Image, { ImageFitVariant } from "../../../components/image";
import WelcomeProps from "./types";

import * as MobileWelcomeImage from "./mobile_welcome.png";

export default function MobileWelcome({ loggedIn }: WelcomeProps) {
    if (loggedIn) {
        return null;
    }

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
        <div className="mobile-welcome">
            <Slider {...settings}>
                <div>
                    <Link to="/about">
                        <Image className="welcome-image" height={230} width={400} fit={ImageFitVariant.COVER} src={MobileWelcomeImage} />
                    </Link>
                </div>
            </Slider>
        </div>
    );
}
