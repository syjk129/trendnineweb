import * as React from "react";
import { isMobile } from "react-device-detect";
import * as ReactDOM from "react-dom";
import { Link, withRouter } from "react-router-dom";

import Image, { ImageFitVariant } from "../image";
import CardContainer from "./cardContainer";

import "./style.scss";

interface CardProps {
    imageUrl: string;
    gridSize: number;
    redirectUrl?: string;
    scaleImage?: boolean;
    title: string;
    singleLineTitle?: boolean;
    hoverItem?: React.ReactNode;
    footerItem?: React.ReactNode;
}

interface CardState {
}

class Card extends React.Component<CardProps, CardState> {
    state: CardState = { };

    componentDidMount() { }

    render() {
        const { imageUrl, scaleImage, redirectUrl, gridSize, title, singleLineTitle, hoverItem, footerItem } = this.props;

        let classes = "card";

        if (gridSize) {
            classes += ` grid-size-${gridSize}`;
        }

        if (isMobile) {
            classes += " mobile";
        }

        return (
            <div className={classes} ref="card">
                {hoverItem && !isMobile && (
                    <div className="card-hover-details" ref="hover">
                        {hoverItem}
                    </div>
                )}
                <Link to={redirectUrl}>
                    <Image
                        className="card-image"
                        src={imageUrl}
                        fit={scaleImage ? ImageFitVariant.SCALED : ImageFitVariant.COVER}
                        square
                    />
                </Link>
                {gridSize < 3 && (
                    <div className="card-content">
                        <div className="card-title-container">
                            <Link className="title" htmlTag="p" to={redirectUrl} maxLines={singleLineTitle ? 1 : 2}>
                                {title}
                            </Link>
                        </div>
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
