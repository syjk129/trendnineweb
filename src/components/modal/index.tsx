import * as React from "react";
import { isMobile } from "react-device-detect";

import { IconButton } from "../button";
import { IconSize, IconVariant } from "../icon";
import "./style.scss";

interface ModalProps {
    children: React.ReactNode;
    className?: string;
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
        const { children, className } = this.props;

        const style = {
            display: this.state.open ? "block" : "none",
        };

        let classes = "modal-content";
        if (className) {
            classes += ` ${className}`;
        }

        return (
            <div className={isMobile ? "mobile-modal" : "modal"} ref={this._modalRef} style={style}>
                <div className={classes}>
                    <div className="modal-header">
                        <span className="close" onClick={this._close}>&times;</span>
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
