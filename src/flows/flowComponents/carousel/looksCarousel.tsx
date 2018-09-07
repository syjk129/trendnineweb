import * as React from "react";
import Slider from "react-slick";

import { PostPreview } from "../../../api/models";
import { IconVariant } from "../../../components/icon";
import LookCard from "../cardView/lookCard";
import CarouselArrow from "./carouselArrow";

interface LooksCarouselProps {
    looks: Array<PostPreview>;
}

export default class LooksCarousel extends React.Component<LooksCarouselProps> {
    render() {
        const settings = {
            arrows: true,
            prevArrow: <CarouselArrow icon={IconVariant.ARROW_LEFT} />,
            nextArrow: <CarouselArrow icon={IconVariant.ARROW_RIGHT} />,
            infinite: true,
            slidesToShow: 5,
            variableWidth: false,
        };

        return (
            <div className="looks-carousel">
                <Slider { ...settings }>
                    {this.props.looks.map(look => (
                        <div>
                            <LookCard look={look} />
                        </div>
                    ))}
                </Slider>
            </div>
        );
    }
}
