import ImageResize from "quill-image-resize-module";
import * as React from "react";
import ReactQuill, { Quill } from "react-quill";
Quill.register("modules/imageResize", ImageResize);

import "react-quill/dist/quill.snow.css";
import "./style.scss";

import { PresignedPostRequest } from "../../../api/requests";
import uploadImage from "../../../util/uploadImage";

interface PostEditorProps {
    editorState: string;
    onChange(editorState: string): void;
    getPresignedPost(request: PresignedPostRequest): void;
}

export default class PostEditor extends React.Component<PostEditorProps> {
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
            <ReactQuill
                theme="snow"
                modules={this._modules}
                formats={this._formats}
                value={this.props.editorState}
                ref={(el) => this._reactQuillRef = el}
                onChange={this.props.onChange}
            />
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

    private _uploadImage = async () => {
        // TODO: error handling
        if (!this._quillRef) return;

        const range = this._quillRef.getSelection();
        const position = range ? range.index : 0;
        this._quillRef.insertEmbed(position, "image", "https://trendnine.s3.amazonaws.com/images/2018/08/164b87a3c8c04d959cbd10077260587a.jpg");
        // TODO: modal handler for upload image?
    }

    private _getModules = () => {
        return {
            toolbar: {
                container: [
                    [{ "header": [1, 2, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{"list": "ordered"}, {"list": "bullet"}, {"indent": "-1"}, {"indent": "+1"}],
                    ["link", "image"],
                    ["clean"],
                ],
                handlers: {
                    image: this._uploadImage,
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
