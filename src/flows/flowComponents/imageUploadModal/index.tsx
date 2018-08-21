import { PropTypes } from "prop-types";
import * as React from "react";

import { PresignedPostRequest } from "../../../api/requests";
import { AppContext } from "../../../app";
import Button, { ButtonSize, ButtonVariant, ImageUploadButton } from "../../../components/button";
import Modal from "../../../components/modal";
import TextArea from "../../../components/textArea";
import uploadImage from "../../../util/uploadImage";

import "./style.scss";

interface ImageUploadModalProps {
    modalOpen: boolean;
    setImage(image: string, altText: string): void;
    close(): void;
}

interface ImageUploadModalState {
    isProcessing: boolean;
    image: string | null;
    altText: string | null;
}

export default class ImageUploadModal extends React.Component<ImageUploadModalProps, ImageUploadModalState> {
    static contextTypes: AppContext;

    state: ImageUploadModalState = {
        isProcessing: false,
        image: null,
        altText: null,
    };

    render() {
        if (!this.props.modalOpen) {
            return null;
        }

        return (
            <Modal className="image-upload-modal" isOpen={this.props.modalOpen} close={this.props.close}>
                <div className="image-upload">
                    <div className="file-upload">
                        <div className="input-label">Upload Image*</div>
                        <div className="image-preview-dnd" onDrop={this._onImageDrop} onDragOver={this._onDragOver}>
                            {this.state.image ? (
                                <img src={this.state.image} />
                            ) : (
                                <div className="dnd-text">
                                    Drag and Drop Images
                                </div>
                            )}
                        </div>
                        <div className="image-upload-button-container">
                            <ImageUploadButton
                                isProcessing={this.state.isProcessing}
                                setProcessing={this._setProcessing}
                                setImage={this._setImage}
                            />
                        </div>
                    </div>
                    <div className="file-description">
                        <div className="alt-text-label">
                            <div className="input-label">Alt Text*</div>
                            <TextArea value={this.state.altText} onChange={this._altTextChange} placeholder="Alt Text"/>
                        </div>
                        <div className="image-upload-modal-actions">
                            <Button size={ButtonSize.SMALL} variant={ButtonVariant.OUTLINE} onClick={this.props.close} inline>Cancel</Button>
                            <Button size={ButtonSize.SMALL} onClick={this._submitImage} inline>Insert Image</Button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

    private _onImageDrop = async (event) => {
        event.preventDefault();

        let file;
        if (event.dataTransfer.items) {
            for (let i = 0; i < event.dataTransfer.items.length; i++) {
                if (event.dataTransfer.items[i].kind === "file") {
                    file = event.dataTransfer.items[i].getAsFile();
                    break;
                }
            }
        } else if (event.dataTransfer.files.length > 0) {
            file = event.dataTransfer.files[0];
        }

        if (file) {
            this.setState({ isProcessing: true });
            const image = await uploadImage(file, this._getPresignedPost);
            this.setState({ image, isProcessing: false });
        }

        this._removeDragData(event);
    }

    private _removeDragData = (event) => {
        if (event.dataTransfer) {
            if (event.dataTransfer.items) {
                event.dataTransfer.items.clear();
            } else {
                event.dataTransfer.clearData();
            }
        }
    }

    private _onDragOver = (event) => {
        event.preventDefault();
    }

    private _getPresignedPost = (request: PresignedPostRequest) => {
        return this.context.api.getPresignedPost(request);
    }
    private _submitImage = () => {
        if (!this.state.image || !this.state.altText) {
            // TODO: Error Handling
            return;
        }
        this.props.setImage(this.state.image, this.state.altText);
        this.props.close();
    }

    private _setImage = (image: string) => {
        this.setState({ image });
    }

    private _setProcessing = (isProcessing: boolean) => {
        this.setState({ isProcessing });
    }

    private _altTextChange = (altText: string) => {
        this.setState({ altText });
    }
}

ImageUploadModal.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
