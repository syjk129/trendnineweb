import { PropTypes } from "prop-types";
import * as React from "react";
import * as SparkMD5 from "spark-md5";
import "whatwg-fetch";

import { PresignedPostRequest } from "../../api/requests";
import { AppContext } from "../../app";
import uploadImage from "../../util/uploadImage";

interface ImageUploadButtonProps {
    className?: string;
    isProcessing: boolean;
    setProcessing(isProcessing: boolean): void;
    setImage(imageUrl: string): void;
}

export default class ImageUploadButton extends React.Component<ImageUploadButtonProps> {
    static contextTypes: AppContext;

    componentWillMount() {
        this._buttonRef = React.createRef();
    }

    render() {
        return (
            <input
                className={this.props.className}
                type="file"
                onChange={this._uploadImage}
                ref={this._buttonRef}
            />
        );
    }

    private _buttonRef: React.RefObject<HTMLInputElement>;

    private _uploadImage = async (event) => {
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
            console.log("too big nigga");
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
