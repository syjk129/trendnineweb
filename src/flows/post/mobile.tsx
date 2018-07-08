import autobind from "autobind-decorator";
import * as React from "react";
import { isMobile } from "react-device-detect";

import { PostPreview } from "../../api/models";
import Carousel, { CarouselItem } from "../../components/carousel";
import Icon, { IconSize, IconVariant } from "../../components/icon";
import Image, { ImageRatioVariant } from "../../components/image";
import formatTime from "../../util/formatTime";
import ActionLinks, { ActionLinksVariant } from "../flowComponents/actions";
import Author from "../flowComponents/author";
import Comments from "../flowComponents/comments";
import { ContentSection, SidebarSection, TabbedSection } from "../flowComponents/section";
import Tag from "../flowComponents/tag";
import PostAuthorDetails from "./postAuthorDetails";
import { MobilePostProps, MobilePostState, TabbedSectionTypes } from "./types";

export default class MobilePost extends React.Component<MobilePostProps, MobilePostState> {
    state: MobilePostState = {
        section: TabbedSectionTypes.PRODUCTS_IN_THIS_POST,
        tabbedContent: this.props.post.products,
    };

    render() {
        const {
            likes,
            liked,
            wishlisted,
            post,
            comments,
            likeComment,
            unlikeComment,
            submitComment,
            toggleLike,
            toggleWishlist,
        } = this.props;

        return (
            <div className="mobile-post">
                <div className="post-content">
                    <Image
                        className="post-cover"
                        src={post.cover_image.original_image_url}
                    />
                    <p className="post-title">
                        {post.title}
                    </p>
                    <div className="post-subtitle">
                        <PostAuthorDetails
                            author={post.author}
                            iconSize={isMobile ? IconSize.MEDIUM : IconSize.LARGE}
                            postDate={new Date(post.created)}
                            postId={post.id}
                            wishlisted={wishlisted}
                            likes={likes}
                            liked={liked}
                            toggleLike={toggleLike}
                            toggleWishlist={toggleWishlist}
                        />
                    </div>
                    <div className="post-details">
                        {/* TODO: Don't use dangerouslySetInnerHTML. Make this safer */}
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                </div>
                <TabbedSection
                    selected={this.state.section}
                    sections={[TabbedSectionTypes.PRODUCTS_IN_THIS_POST, TabbedSectionTypes.YOU_MAY_ALSO_LIKE]}
                    onSectionChange={this._onSectionChange}
                />
                <Carousel>
                    {this.state.tabbedContent.map(content => (
                        this._renderTabbedContent(content)
                    ))}
                </Carousel>
                {post.tags.length > 0 && (
                    <ContentSection title="Tags">
                        {post.tags.map(tag => (
                            <Tag tag={tag} inline />
                        ))}
                    </ContentSection>
                )}
                <ContentSection title="Comments">
                    <Comments
                        comments={comments}
                        likeComment={likeComment}
                        unlikeComment={unlikeComment}
                        submitComment={submitComment}
                    />
                </ContentSection>
            </div>
        );
    }

    private _renderTabbedContent = (content: any) => {
        switch (this.state.section) {
            case TabbedSectionTypes.PRODUCTS_IN_THIS_POST:
                return (
                    <div>
                        <CarouselItem
                            imageUrl={content.image && content.image.thumbnail_image_url}
                            redirectUrl={`/product/${content.id}`}
                            title={(content.brand && content.brand.name) || (content.author && content.author.username)}
                            detail={content.title}
                            subdetail={ this._renderProductFooter(content) }
                        />
                    </div>
                );
            case TabbedSectionTypes.YOU_MAY_ALSO_LIKE:
                return (
                    <div className="tabbed-content-carousel-item-container">
                        <CarouselItem
                            className="tabbed-content-carousel-item"
                            imageUrl={content.cover_image && content.cover_image.thumbnail_image_url}
                            redirectUrl={`/post/${content.id}`}
                            title={(content.username) || (content.author && content.author.username)}
                            detail={content.title}
                            subdetail={ this._renderPostFooter(content) }
                        />
                    </div>
                );
        }
    }

    @autobind
    private _onSectionChange(section: TabbedSectionTypes) {
        let tabbedContent;
        switch (section) {
            case TabbedSectionTypes.PRODUCTS_IN_THIS_POST:
                tabbedContent = this.props.post.products;
                break;
            case TabbedSectionTypes.YOU_MAY_ALSO_LIKE:
                tabbedContent = this.props.relatedPosts;
                break;
        }
        this.setState({ tabbedContent, section });
    }

    private _renderPostFooter = (post: PostPreview) => {
        return (
            <>
                <div className="author-date">
                    <Author author={post.author} />
                    {formatTime(post.created)}
                </div>
                <div className="post-card-footer">
                    <ActionLinks
                        iconSize={IconSize.MEDIUM}
                        variant={ActionLinksVariant.POST}
                        id={post.id}
                        wishlisted={post.wishlisted}
                        liked={post.liked}
                        likes={post.likes}
                    />
                </div>
            </>
        );
    }

    @autobind
    private _renderProductFooter(product) {
        return (
        <div className="post-card-hover-footer">
            <p className="post-card-hover-price">
                {`$${product.price}`}
            </p>
            <ActionLinks
                variant={ActionLinksVariant.PRODUCT}
                id={product.id}
                wishlisted={product.wishlisted}
                hideShare
            />
        </div>);
    }
}
