import * as React from "react";
import { isMobile } from "react-device-detect";

interface StickyProps {
    id: string;
    stickyClassName: string;
    children: React.ReactNode;
}

export default class Sticky extends React.Component<StickyProps, never>  {
    private stickOffset = 0;
    private sticky;

    componentDidMount() {
        this.sticky = document.getElementById(this.props.id);
        this.stickOffset = this.sticky.offsetTop;
        window.addEventListener("scroll", this.onScroll, false);
    }

    onScroll = () => {
        const navbarHeight = isMobile ? 60 : 100;
        if (window.pageYOffset + navbarHeight >= this.stickOffset) {
            this.sticky.classList.add(this.props.stickyClassName);
        } else {
            this.sticky.classList.remove(this.props.stickyClassName);
        }
    }

    render() {
        const { id, children } = this.props;
        return (
            <div id={id}>
                {children}
            </div>
        );
    }
}
