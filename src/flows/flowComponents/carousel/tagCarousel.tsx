import * as React from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import { PostTag } from "../../../api/models";
import { IconVariant } from "../../../components/icon";
import CarouselArrow from "./carouselArrow";

interface CarouselTagProps {
    tag: PostTag;
    selected: boolean;
    className?: string;
}

export class CarouselTag extends React.Component<CarouselTagProps> {
    render() {
        return (
            <div className={this.props.className}>
                <Link
                    to={{
                        pathname: "/looks",
                        state: { refresh: true },
                        search: `tags=${this.props.tag.content}`,
                    }}
                    className="carousel-tag"
                >
                    <div className={`carousel-tag-image-container${this.props.selected ? " selected" : ""}`}>
                        <img className="carousel-tag-image" src={this.props.tag.cover_image && this.props.tag.cover_image.small_image_url || "https://i.ytimg.com/vi/j6jT1RYHfPg/maxresdefault.jpg"} />
                    </div>
                    <div className="carousel-tag-name">
                        {this.props.tag.content}
                    </div>
                </Link>
            </div>
        );
    }
}

interface TagCarouselProps {
    tags: Array<PostTag>;
    selectedTag?: string;
    className?: string;
}

export default class TagCarousel extends React.Component<TagCarouselProps> {
    render() {
        const initialIndex = this.props.tags.findIndex(tag => tag.content === this.props.selectedTag);
        const settings = {
            arrows: true,
            prevArrow: <CarouselArrow icon={IconVariant.ARROW_LEFT} />,
            nextArrow: <CarouselArrow icon={IconVariant.ARROW_RIGHT} />,
            initialSlide: initialIndex,
            infinite: true,
            slidesToShow: 6,
            variableWidth: false,
            responsive: [
                {
                    breakpoint: 1543,
                    settings: {
                        slidesToShow: 5,
                    },
                },
                {
                    breakpoint: 1243,
                    settings: {
                        slidesToShow: 4,
                    },
                },
                {
                    breakpoint: 1043,
                    settings: {
                        slidesToShow: 3,
                    },
                },
            ],
        };

        let classes = "tag-carousel";

        if (this.props.className) {
            classes += ` ${this.props.className}`;
        }

        if (isMobile) {
            classes += " mobile";

            return (
                <div className={classes}>
                    {this.props.tags.map(tag => (
                        <CarouselTag tag={tag} selected={this.props.selectedTag === tag.content}/>
                    ))}
                </div>
            );
        }

        return (
            <div className={classes}>
                <Slider { ...settings }>
                    {this.props.tags.map(tag => (
                        <CarouselTag tag={tag} selected={this.props.selectedTag === tag.content}/>
                    ))}
                </Slider>
            </div>
        );
    }
}


