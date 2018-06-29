import * as React from "react";
import Slider, { Settings } from "react-slick";

import { IconButton } from "../button";
import { IconSize, IconVariant } from "../icon";
import { CarouselProps } from "./types";

export default function DesktopCarousel({
    className,
    attributes,
    children,
    slidesToShow,
}: CarouselProps) {
    let childrenCount = 0;
    React.Children.forEach(children, () => childrenCount ++);
    let settings = {
        adaptiveHeight: false,
        // dots: true,
        infinite: true,
        prevArrow: <IconButton icon={IconVariant.ARROW_LEFT} />,
        nextArrow: <IconButton icon={IconVariant.ARROW_RIGHT} />,
        slidesToScroll: 1,
        slidesToShow: 5,
        variableWidth: true,
        responsive: [{
            breakpoint: 1543,
            settings: {
              slidesToShow: Math.min(5, childrenCount),
            },
          },
          {
            breakpoint: 1443,
            settings: {
              slidesToShow: Math.min(4, childrenCount),
            },
          },
          {
            breakpoint: 1243,
            settings: {
              slidesToShow: Math.min(3, childrenCount),
            },
          },
          {
            breakpoint: 1043,
            settings: {
              slidesToShow: Math.min(2, childrenCount),
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
