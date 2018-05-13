import * as React from "react";

interface StickyProps {
    id: string;
    stickyClassName: string;
    children: React.ReactNode;
}

export class Sticky extends React.Component<StickyProps, never>  {
    private NAVBAR_HEIGHT = 100;
    private stickOffset = 0;
    private sticky;

    componentDidMount() {
        this.sticky = document.getElementById(this.props.id);
        this.stickOffset = this.sticky.offsetTop;

        window.addEventListener("scroll", this.onScroll, false);
    }

    onScroll = () => {
        if (window.pageYOffset + this.NAVBAR_HEIGHT >= this.stickOffset) {
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
        </div>);
    }
}
