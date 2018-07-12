import * as React from "react";
import { isMobile } from "react-device-detect";
import * as ReactDOM from "react-dom";
import { Link, withRouter } from "react-router-dom";

import Image, { ImageFitVariant } from "../image";
import CardContainer from "./cardContainer";

import "./style.scss";

interface CardProps {
    imageUrl: string;
    className?: string;
    gridSize: number;
    redirectUrl?: string;
    newWindowUrl?: string;
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
        const { imageUrl, className, scaleImage, redirectUrl, gridSize, title, singleLineTitle, hoverItem, footerItem } = this.props;

        let classes = "card";

        if (className) {
            classes += ` ${className}`;
        }

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
                <Link to={redirectUrl} onClick={this._onClick}>
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
                            <Link className="title" htmlTag="p" to={redirectUrl} onClick={this._onClick} maxLines={singleLineTitle ? 1 : 2}>
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

    private _onClick = () => {
        if (this.props.newWindowUrl) {
            window.open(this.props.newWindowUrl);
        }
    }
}

export default withRouter(Card);

export { CardContainer };
