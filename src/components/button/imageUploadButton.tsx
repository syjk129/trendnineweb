import { PropTypes } from "prop-types";
import * as React from "react";
import "whatwg-fetch";

import { PresignedPostRequest } from "../../api/requests";
import { AppContext } from "../../app";
import Spinner from "../../components/spinner";
import uploadImage from "../../util/uploadImage";
import { generateUUID } from "../../util/uuid";

import "./style.scss";

interface ImageUploadButtonProps {
    className?: string;
    id?: string;
    isProcessing: boolean;
    setProcessing(isProcessing: boolean): void;
    setImage(imageUrl: string): void;
}

export default class ImageUploadButton extends React.Component<ImageUploadButtonProps> {
    static contextTypes: AppContext;

    componentWillMount() {
        this._buttonRef = React.createRef();
        this._inputId = generateUUID();
    }

    render() {
        let classes = "image-upload-button";
        if (this.props.className) {
            classes += ` ${this.props.className}`;
        }

        return (
            <>
                <input
                    id={this.props.id || this._inputId}
                    className={classes}
                    type="file"
                    onChange={this._uploadImage}
                    ref={this._buttonRef}
                />
                <label className="image-upload-button-label" htmlFor={this.props.id || this._inputId}>{this.props.isProcessing ? <Spinner flat noPadding /> : "Select File"}</label>
            </>
        );
    }

    private _buttonRef: React.RefObject<HTMLInputElement>;
    private _inputId: string;

    private _uploadImage = async () => {
        if (!this._buttonRef.current) {
            return;
        }
        const files = this._buttonRef.current;
        if (!("files" in files) || files.files.length === 0) {
            return;
        }
        this.props.setProcessing(true);

        const imageFile = files.files[0];
        if (imageFile.size > 10000000) {
            console.log("too big");
        }

        const image = await uploadImage(imageFile, this._getPresignedPost);
        this.props.setImage(image);
        this.props.setProcessing(false);
    }

    private _getPresignedPost = (request: PresignedPostRequest) => {
        return this.context.api.getPresignedPost(request);
    }
}

ImageUploadButton.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
