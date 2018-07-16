import * as React from "react";
import { isMobile } from "react-device-detect";

interface StickyProps {
    id: string;
    stickyClassName: string;
    children: React.ReactNode;
    isSticked?(bool: boolean): void;
}

export default class Sticky extends React.Component<StickyProps, never>  {
    private stickOffset = 0;

    componentWillMount() {
        this._stickyRef = React.createRef();
    }

    componentDidMount() {
        this.stickOffset = this._stickyRef.current.offsetTop;
        document.addEventListener("scroll", this.onScroll, false);
        document.addEventListener("touchmove", this.onScroll, false);
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", this.onScroll);
        document.removeEventListener("touchmove", this.onScroll);
    }

    onScroll = () => {
        const header = document.getElementById("header");
        const footer = document.getElementById("footer");
        const sticky = this._stickyRef.current;
        const stickyContent = sticky.children.item(0);
        const navbarHeight = header.offsetTop + header.getBoundingClientRect().height;
        const childHeight = stickyContent.getBoundingClientRect().height;

        if (sticky) {
            if (footer.getBoundingClientRect().top - childHeight - 20 <= header.getBoundingClientRect().height) {
                sticky.style.top = `${footer.getBoundingClientRect().top - childHeight - 20}px`;
            } else if (window.scrollY + navbarHeight >= this.stickOffset) {
                sticky.classList.add(this.props.stickyClassName);
                sticky.style.top = `${navbarHeight}px`;
                if (this.props.id === "filter-container") {
                    sticky.style.width = `${document.getElementById("content").offsetWidth + 20}px`;
                }
                if (this.props.isSticked) {
                    this.props.isSticked(true);
                }
            } else {
                sticky.classList.remove(this.props.stickyClassName);
                sticky.removeAttribute("style");
                if (this.props.isSticked) {
                    this.props.isSticked(false);
                }
            }
        }
    }

    render() {
        const { id, children } = this.props;
        return (
            <div id={id} ref={this._stickyRef}>
                {children}
            </div>
        );
    }

    private _stickyRef: React.RefObject<HTMLDivElement>;
}
