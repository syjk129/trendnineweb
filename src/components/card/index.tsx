import * as H from "history";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { withRouter } from "react-router-dom";
import TimeAgo from "react-timeago";

import { Post } from "../../api/models";
import Anchor, { AnchorVariant } from "../../components/anchor";
import Wishlist, { WishlistType } from "../../components/anchor/wishlist";
import Author from "../../components/author";
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
        const rect = ReactDOM.findDOMNode(this.refs.card).getBoundingClientRect();
        if (rect.left + rect.width + 420 < window.innerWidth) {
            this.setState({ hoverX: rect.width });
        } else {
            this.setState({ hoverX: -460 });
        }
    }

    render() {
        const { imageUrl, redirectUrl, title, history, hoverItem, footerItem } = this.props;

        const onClick = redirectUrl ? () => history.push(redirectUrl) : undefined;

        const hoverStyles = {
            marginLeft: this.state.hoverX,
        };

        return (
            <div className="card" ref="card">
                {hoverItem && (
                    <div className="card-hover-details" ref="hover" style={hoverStyles}>
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
