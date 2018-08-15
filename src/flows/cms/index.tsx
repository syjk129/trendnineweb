import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";

import { AppContext } from "../../app";
import Button from "../../components/button";
import RouteProps from "../routeProps";
import { PostDraft, PostType } from "./types";

import "./style.scss";

type Props = RouteProps;

interface CMSViewState {
    uploads: Array<any>;
    featured: Array<any>;
    nextToken: string | null;
}

export default class CMSView extends React.Component<Props, CMSViewState> {
    static contextTypes: AppContext;

    state: CMSViewState = {
        uploads: [],
        featured: [],
        nextToken: null,
    };

    async componentWillMount() {
        const user = JSON.parse(localStorage.getItem("user"));

        // You should not be able to post if you are not an influencer or admin
        if (user["auth_level"] < 2) {
            this.props.history.push("/");
        }
        this._isManager = user["auth_level"] >= 3;
        this._draft = JSON.parse(localStorage.getItem("post_draft")) as PostDraft;

        if (this._isManager) {
            // set uploads as edit/articles
        } else {
            const content = await this.context.api.getPostsForUser(user.id);
            this.setState({ uploads: content.list, nextToken: content.nextToken });
        }
    }

    render() {
        if (isMobile) {
            return <div>Mobile Upload not supported yet. Please use the desktop version of the website </div>;
        }

        return (
            <div className="cms">
                {this._draft && (
                    <div className="draft">
                        <p className="">
                            You have an unfinished upload
                        </p>
                        <Button onClick={this._editDraft}>Continue</Button>
                    </div>
                )}
                {this._isManager && (
                    <div className="list-container">
                        <h4>Featured Articles</h4>
                        <table>
                            <tr>
                                <th>Order</th>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th></th>
                            </tr>
                            {this.state.featured.map(post => (
                                <tr>
                                </tr>
                            ))}
                        </table>
                    </div>
                )}
                <div className="list-container">
                    <h4>Uploads</h4>
                    <table>
                        <tr>
                            <th>Title</th>
                            <th>Date</th>
                            <th></th>
                        </tr>
                        {this._isManager ? (
                            <>
                                <Button onClick={() => this._createNew(PostType.ARTICLE)}>Create New Article</Button>
                                <Button onClick={() => this._createNew(PostType.EDIT)}>Create New Edit</Button>
                            </>
                        ) : (
                            <Button onClick={() => this._createNew(PostType.BLOG)}>Create New Blog</Button>
                        )}
                        {this.state.uploads.map(post => (
                            <tr>
                                <th>{post.title}</th>
                                <th>01/01/01</th>
                                <th>Edit</th>
                            </tr>
                        ))}
                    </table>
                </div>
            </div>
        );
    }

    private _isManager: boolean;
    private _draft: PostDraft;

    private _createNew = (postType: PostType) => {
        switch (postType) {
            case PostType.ARTICLE:
                this.props.history.push("/upload/article");
                return;
            case PostType.BLOG:
                this.props.history.push("/upload/blog");
                return;
            case PostType.EDIT:
                this.props.history.push("/upload/editorial");
                return;
        }
    }

    private _editDraft = () => {
        console.log(this._draft);
        switch (this._draft.type) {
            case PostType.ARTICLE:
                return;
            case PostType.BLOG:
                this.props.history.push("/upload/blog");
                return;
            case PostType.EDIT:
                return;
        }
    }
}

CMSView.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
