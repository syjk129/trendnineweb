import * as React from "react";
import * as H from "history";
import { withRouter } from "react-router-dom";
import TimeAgo from "react-timeago";

import { Post } from "../../api/models";
import Author from "../../components/author";
import Anchor, { AnchorVariant } from "../../components/anchor";
import Wishlist, { WishlistType } from "../../components/anchor/wishlist";
import Carousel, { CarouselItem } from "../../components/carousel";
import Icon, { IconVariant } from "../../components/icon";
import Image from "../../components/image";
import CardContainer from "./cardContainer";

import "./style.scss";

interface CardProps {
    imageUrl: string;
    redirectUrl?: string;
    title: string;
    history: H.History;
    hoverItem?: React.ReactNode;
    footerItem?: React.ReactNode;
}

class Card extends React.Component<CardProps> {
    render() {
        const { imageUrl, redirectUrl, title, history, hoverItem, footerItem } = this.props;

        const onClick = redirectUrl ? () => history.push(redirectUrl) : undefined;

        return (
            <div className="card">
                {hoverItem && (
                    <div className="card-hover-details">
                        {hoverItem}
                    </div>
                )}
                <Image
                    src={imageUrl}
                    onClick={onClick}
                    square
                />
                <div className="card-content">
                    <p className="title" onClick={onClick}>
                        {title}
                    </p>
                    {footerItem && (
                        <div className="card-footer">
                            {footerItem}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(Card);

export { CardContainer };
