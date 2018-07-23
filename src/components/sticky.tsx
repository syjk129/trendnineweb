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
        this._placeholderRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener("scroll", this.onScroll, false);
        document.addEventListener("touchmove", this.onScroll, false);
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", this.onScroll);
        document.removeEventListener("touchmove", this.onScroll);
    }

    onScroll = () => {
        if (!this._stickOffset) {
            this._stickOffset = this._stickyRef.current.offsetTop;
        }
        const header = document.getElementById("header");
        const footer = document.getElementById("footer");
        const sticky = this._stickyRef.current;
        const placeholder = this._placeholderRef.current;
        const stickyContent = sticky.children.item(0);
        const navbarHeight = header.offsetTop + header.getBoundingClientRect().height;
        const childHeight = stickyContent.getBoundingClientRect().height;

        if (sticky) {
            if (footer && footer.getBoundingClientRect().top - childHeight - 20 <= header.getBoundingClientRect().height) {
                sticky.style.top = `${footer.getBoundingClientRect().top - childHeight - 20}px`;
            } else if (window.scrollY + navbarHeight >= this._stickOffset) {
                sticky.classList.add(this.props.stickyClassName);
                placeholder.style.height = `${childHeight}px`;
                placeholder.classList.remove("hidden");
                sticky.style.top = `${navbarHeight}px`;
                if (this.props.id === "filter-container") {
                    sticky.style.width = `${document.getElementById("content").offsetWidth + 20}px`;
                }
                if (this.props.isSticked) {
                    this.props.isSticked(true);
                }
            } else {
                placeholder.classList.add("hidden");
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
            <>
                <div id={id} ref={this._stickyRef}>
                    {children}
                </div>
                <div className="sticky-placeholder hidden" ref={this._placeholderRef} id="sticky-placeholder">
                </div>
            </>
        );
    }

    private _stickyRef: React.RefObject<HTMLDivElement>;
    private _placeholderRef: React.RefObject<HTMLDivElement>;
    private _stickOffset: number;
}
