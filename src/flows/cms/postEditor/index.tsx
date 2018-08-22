import ImageResize from "quill-image-resize-module";
import * as React from "react";
import ReactQuill, { Quill } from "react-quill";
Quill.register("modules/imageResize", ImageResize);

import "react-quill/dist/quill.snow.css";
import "./style.scss";

import { PresignedPostRequest } from "../../../api/requests";
import ImageUploadModal from "../../flowComponents/imageUploadModal";

// Custom Image Blot to add alt text to images
const BlockEmbed = Quill.import("blots/block/embed");
class ImageBlot extends BlockEmbed {
    static create(value) {
        let node = super.create();
        node.setAttribute("alt", value.alt);
        node.setAttribute("src", value.src);
        return node;
    }

    static value(node) {
        return {
            alt: node.getAttribute("alt"),
            src: node.getAttribute("src"),
        };
    }
}
ImageBlot.blotName = "image";
ImageBlot.tagName = "img";
Quill.register(ImageBlot);

interface PostEditorProps {
    editorState: string;
    onChange(editorState: string): void;
    getPresignedPost(request: PresignedPostRequest): void;
}

interface PostEditorState {
    modalOpen: boolean;
}

export default class PostEditor extends React.Component<PostEditorProps, PostEditorState> {
    state: PostEditorState = {
        modalOpen: false,
    };

    componentWillMount() {
        this._modules = this._getModules();
        this._formats = this._getFormats();
    }

    componentDidMount() {
        this._attachQuillRef();
    }

    componentDidUpdate() {
        this._attachQuillRef();
    }

    render() {
        return (
            <>
                <ReactQuill
                    className="post-editor"
                    theme="snow"
                    modules={this._modules}
                    formats={this._formats}
                    value={this.props.editorState}
                    ref={(el) => this._reactQuillRef = el}
                    onChange={this.props.onChange}
                />
                <ImageUploadModal
                    modalOpen={this.state.modalOpen}
                    setImage={this._insertImage}
                    close={this._closeModal}
                />
            </>
        );
    }

    private _modules: any;
    private _formats: any;
    private _quillRef: any;
    private _reactQuillRef: any;

    private _attachQuillRef = () => {
        if (!this._reactQuillRef || typeof this._reactQuillRef.getEditor !== "function") return;
        this._quillRef = this._reactQuillRef.getEditor();
    }

    private _uploadImageHandler = async () => {
        if (!this._quillRef) return;
        this.setState({ modalOpen: true });
    }

    private _insertImage = (image: string, altText: string) => {
        const range = this._quillRef.getSelection();
        const position = range ? range.index : 0;
        this._quillRef.insertEmbed(position, "image", { alt: altText, src: image });
    }

    private _closeModal = () => {
        this.setState({ modalOpen: false });
    }

    private _getModules = () => {
        return {
            toolbar: {
                container: [
                    [{ "header": [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{"list": "ordered"}, {"list": "bullet"}, {"indent": "-1"}, {"indent": "+1"}],
                    ["link", "image"],
                    ["clean"],
                ],
                handlers: {
                    image: this._uploadImageHandler,
                },
            },
            imageResize: {},
        };
    }

    private _getFormats = () => {
        return [
            "header",
            "bold", "italic", "underline", "strike", "blockquote",
            "list", "bullet", "indent",
            "link", "image",
        ];
    }
}
