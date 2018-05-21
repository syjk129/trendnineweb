import * as React from "react";

import "./style.scss";

interface MobileCarouselItemProps {
    children: React.ReactNode;
}

export default class MobileCarouselItem extends React.Component<MobileCarouselItemProps> {
    componentDidMount() {
        const carouselItems = document.getElementsByClassName("mobile-carousel-item");
        carouselItems[0].setAttribute("style", `width: ${window.innerWidth - (60 + 2 * 14)}px`);
        carouselItems[1].setAttribute("style", `width: ${window.innerWidth - (60 + 2 * 14)}px`);
    }

    render() {
        return (
            <div className="mobile-carousel-item">
                {this.props.children}
            </div>
        );
    }
}
