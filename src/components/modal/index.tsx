import * as React from "react";
import { isMobile } from "react-device-detect";

import { noScroll, removeNoScroll } from "../../util/scroll";

import "./style.scss";

interface ModalProps {
    children: React.ReactNode;
    className?: string;
    fullScreen?: boolean;
    hideClose?: boolean;
    isOpen: boolean;
    scrollRef?: React.RefObject<HTMLDivElement>;
    contentRef?: React.RefObject<HTMLDivElement>;
    close(): void;
}

interface ModalState {
    open: boolean;
}

export default class Modal extends React.Component<ModalProps> {
    state: ModalState = {
        open: this.props.isOpen,
    };

    componentWillMount() {
        this._modalRef = React.createRef();
    }

    componentDidMount() {
        window.onclick = event => {
            const scrollRef = this.props.scrollRef ? this.props.scrollRef.current : this._modalRef.current;
            if (event.target === scrollRef) {
                this._close();
            }
        };
        window.addEventListener("keyup", this._onKeyPress);
        noScroll();
    }

    componentWillUnmount() {
        window.removeEventListener("keyup", this._onKeyPress);
        removeNoScroll();
    }

    componentWillReceiveProps(nextProps: ModalProps) {
        if (nextProps.isOpen !== this.props.isOpen) {
            if (nextProps.isOpen) {
                this._open();
            } else {
                this._close();
            }
        }
    }

    render() {
        const { children, fullScreen, hideClose, className } = this.props;

        const style = {
            display: this.state.open ? "flex" : "none",
        };

        let classes = "modal-content";
        if (className) {
            classes += ` ${className}`;
        }

        if (fullScreen) {
            classes += " full-screen";
        }

        let containerClasses;
        if (isMobile) {
            containerClasses = "mobile-modal";
        } else {
            containerClasses = "modal";
        }

        if (fullScreen) {
            containerClasses += " full-screen";
        }

        return (
            <div className={containerClasses} ref={this.props.scrollRef || this._modalRef} style={style}>
                <div className={classes} ref={this.props.contentRef}>
                    <div className="modal-header">
                        {!hideClose && (
                            <span className="close" onClick={this._close}>&times;</span>
                        )}
                    </div>
                    {children}
                </div>
            </div>
        );
    }

    private _modalRef: React.RefObject<HTMLDivElement>;

    private _onKeyPress = (event) => {
        if (event.keyCode === 27) {
            this._close();
        }
    }

    private _open = () => {
    }

    private _close = () => {
        removeNoScroll();
        if (this.props.close) {
            this.props.close();
        }
        this.setState({ open: false });
    }
}
