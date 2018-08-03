import * as React from "react";

interface StickyProps {
    id: string;
    stickyClassName: string;
    children: React.ReactNode;
    scrollRef?: React.RefObject<HTMLDivElement>;
    bottomEl?: React.RefObject<HTMLDivElement>;
    maxTop?: number;
    isSticked?(bool: boolean): void;
}

export default class Sticky extends React.Component<StickyProps, never>  {
    componentWillMount() {
        this._stickyRef = React.createRef();
        this._placeholderRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.scrollRef && this.props.scrollRef.current) {
            this.props.scrollRef.current.addEventListener("scroll", this.onScroll, false);
            this.props.scrollRef.current.addEventListener("touchmove", this.onScroll, false);
        } else {
            document.addEventListener("scroll", this.onScroll, false);
            document.addEventListener("touchmove", this.onScroll, false);
        }
    }

    componentWillUnmount() {
        if (this.props.scrollRef && this.props.scrollRef.current) {
            this.props.scrollRef.current.removeEventListener("scroll", this.onScroll);
            this.props.scrollRef.current.removeEventListener("touchmove", this.onScroll);
        } else {
            document.removeEventListener("scroll", this.onScroll);
            document.removeEventListener("touchmove", this.onScroll);
        }
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
        const navbarHeight = this.props.maxTop != null ? this.props.maxTop : header.offsetTop + header.getBoundingClientRect().height;
        const childHeight = stickyContent.getBoundingClientRect().height;
        const bottomEl = this.props.bottomEl ? this.props.bottomEl.current : footer;

        if (sticky) {
            const scrollY = this.props.scrollRef && this.props.scrollRef.current ? this.props.scrollRef.current.scrollTop : window.scrollY;
            if (bottomEl && bottomEl.getBoundingClientRect().top - childHeight - 20 <= header.getBoundingClientRect().height) {
                sticky.style.top = `${bottomEl.getBoundingClientRect().top - childHeight - 20}px`;
            } else if (scrollY + navbarHeight >= this._stickOffset) {
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
