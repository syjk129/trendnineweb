import * as React from "react";
import Slider, { Settings } from "react-slick";

import { IconButton } from "../button";
import { IconSize, IconVariant } from "../icon";
import CarouselItem from "./carouselItem";

import "./style.scss";

interface CarouselProps {
    className?: string;
    attributes?: any;
    slidesToShow?: number;
    children?: React.ReactNode;
}

export default function Carousel({ className, attributes, children, slidesToShow }: CarouselProps) {
    let settings = {
        adaptiveHeight: false,
        // dots: true,
        infinite: true,
        prevArrow: <IconButton icon={IconVariant.ARROW_LEFT} size={IconSize.LARGE} />,
        nextArrow: <IconButton icon={IconVariant.ARROW_RIGHT} size={IconSize.LARGE} />,
        slidesToScroll: 1,
        variableWidth: true,
        responsive: [{
            breakpoint: 1543,
            settings: {
              slidesToShow: 5,
            },
          },
          {
            breakpoint: 1443,
            settings: {
              slidesToShow: 4,
            },
          },
          {
            breakpoint: 1243,
            settings: {
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 1043,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 843,
            settings: {
              slidesToShow: 1,
            },
          }],
    };

    if (attributes) {
        settings = Object.assign(settings, attributes);
    }

    let classes = "carousel-container";

    if (className) {
        classes += ` ${className}`;
    }

    return (
        <div className={classes}>
            <Slider {...settings}>
                {children}
            </Slider>
        </div>
    );
}

export { CarouselItem };
