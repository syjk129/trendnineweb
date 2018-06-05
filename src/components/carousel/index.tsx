import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";

import CarouselItem from "./carouselItem";
import DesktopCarousel from "./desktop";
import MobileCarousel from "./mobile";
import { CarouselProps } from "./types";

import "./style.scss";

export default function Carousel({ ...props }: CarouselProps) {
    return (
        <div>
            <BrowserView device={isBrowser}>
                <DesktopCarousel {...props} />
            </BrowserView>
            <MobileView device={isMobile}>
                <MobileCarousel {...props} />
            </MobileView>
        </div>
    );
}

export { CarouselItem };
