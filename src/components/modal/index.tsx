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
    close(): void;
}

interface ModalState {
    open: boolean;
}

export default class Modal extends React.Component<ModalProps> {
    state: ModalState = {
        open: this.props.isOpen,
    };

    constructor(props: ModalProps) {
        super(props);

        this._modalRef = React.createRef();
    }

    componentDidMount() {
        window.onclick = event => {
            if (event.target === this._modalRef.current) {
                this._modalRef.current.style.display = "none";
                this._close();
            }
        };
        noScroll();
    }

    componentWillUnmount() {
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
            <div className={containerClasses} ref={this._modalRef} style={style}>
                <div className={classes}>
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

    private _open = () => {
    }

    private _close = () => {
        this.props.close();
        this._modalRef.current.style.display = "none";
        this.setState({ open: false });
    }
}
