import * as H from "history";
import * as React from "react";
import { isMobile } from "react-device-detect";
import * as ReactDOM from "react-dom";
import { withRouter } from "react-router-dom";
import TimeAgo from "react-timeago";

import { Post } from "../../api/models";
import Carousel, { CarouselItem } from "../../components/carousel";
import Icon, { IconVariant } from "../../components/icon";
import Image, { ImageFitVariant } from "../../components/image";
import TextContent from "../../components/textContent";
import CardContainer from "./cardContainer";

import "./style.scss";

interface CardProps {
    imageUrl: string;
    gridSize: number;
    redirectUrl?: string;
    scaleImage?: boolean;
    title: string;
    singleLineTitle?: boolean;
    history: H.History;
    hoverItem?: React.ReactNode;
    footerItem?: React.ReactNode;
}

interface CardState {
    hoverX: number;
    hoverY: number;
}

class Card extends React.Component<CardProps, CardState> {
    state: CardState = {
        hoverX: 0,
        hoverY: 0,
    };

    componentDidMount() {
        const cardElement = ReactDOM.findDOMNode(this.refs.card);
        if (cardElement instanceof Element) {
            const rect = cardElement.getBoundingClientRect();
            if (rect.left + rect.width + 420 < window.innerWidth) {
                this.setState({ hoverX: rect.width - 20, hoverY: 20 });
            } else {
                this.setState({ hoverX: - 215, hoverY: 20 });
            }
        }
    }

    render() {
        const { imageUrl, scaleImage, redirectUrl, gridSize, title, singleLineTitle, history, hoverItem, footerItem } = this.props;

        const onClick = redirectUrl ? () => history.push(redirectUrl) : undefined;

        const hoverStyles = {
            marginLeft: this.state.hoverX,
            marginTop: this.state.hoverY,
        };

        let classes = "card";

        if (gridSize) {
            classes += ` grid-size-${gridSize}`;
        }

        return (
            <div className={classes} ref="card">
                {hoverItem && !isMobile && (
                    <div className="card-hover-details" ref="hover" style={hoverStyles}>
                        {hoverItem}
                    </div>
                )}
                <Image
                    src={imageUrl}
                    onClick={onClick}
                    fit={scaleImage ? ImageFitVariant.SCALED : ImageFitVariant.COVER}
                    square
                />
                {gridSize < 3 && (
                    <div className="card-content">
                        <div className="card-title-container">
                        <TextContent className="title" htmlTag="p" onClick={onClick} maxLines={singleLineTitle ? 1 : 2}>
                            {title}
                        </TextContent>
                        </div>
                        {/* <p className={titleClassName} onClick={onClick}>
                            {title}
                        </p> */}
                        {footerItem && (
                            <div className="card-footer">
                                {footerItem}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(Card);

export { CardContainer };
