import * as React from "react";

import "./style.scss";

interface ModalProps {
    children: React.ReactNode;
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
        const { children } = this.props;

        const style = {
            display: this.state.open ? "block" : "none",
        };

        return (
            <div className="modal" ref={this._modalRef} style={style}>
                <div className="modal-content">
                    <span className="close" onClick={this._close}>&times;</span>
                    {children}
                </div>
            </div>
        );
    }

    private _modalRef: React.RefObject<HTMLDivElement>;

    private _open = () => {
        this.setState({ open: true });
    }

    private _close = () => {
        this.props.close();
        this._modalRef.current.style.display = "none";
        this.setState({ open: false });
    }
}
