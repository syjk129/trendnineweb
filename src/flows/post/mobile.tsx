import autobind from "autobind-decorator";
import * as React from "react";

import { Comment, Person, Post, Product } from "../../api/models";
import Carousel, { CarouselItem } from "../../components/carousel";
import Icon, { IconSize, IconVariant } from "../../components/icon";
import Image, { ImageRatioVariant } from "../../components/image";
import ActionLinks, { ActionLinksVariant } from "../flowComponents/actions";
import Comments from "../flowComponents/comments";
import { ContentSection, SidebarSection, TabbedSection } from "../flowComponents/section";
import Tag from "../flowComponents/tag";
import PostAuthorDetails from "./postAuthorDetails";
import ProductTag from "./productTag";
import { MobilePostProps, MobilePostState, TabbedSectionTypes } from "./types";

export default class MobilePost extends React.Component<MobilePostProps, MobilePostState> {
    state: MobilePostState = {
        section: TabbedSectionTypes.PRODUCTS_IN_THIS_POST,
        tabbedContent: this.props.post.products,
    };

    render() {
        const {
            post,
            comments,
            relatedProducts,
            featuredTrendnines,
            likeComment,
            unlikeComment,
            submitComment,
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
                            postDate={new Date(post.created)}
                        />
                        <ActionLinks
                            variant={ActionLinksVariant.POST}
                            id={post.id}
                            wishlisted={post.wishlisted}
                            likes={post.likes}
                            liked={post.liked}
                            iconSize={IconSize.MEDIUM}
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
                        <div>
                            <CarouselItem
                                imageUrl={content.image.small_image_url}
                                redirectUrl={`/product/${content.id}`}
                                title={"content"}
                                detail={"content"}
                                subdetail={ this._renderProductFooter(content) }
                            />
                        </div>
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

    @autobind
    private _onSectionChange(section: TabbedSectionTypes) {
        let tabbedContent;
        switch (section) {
            case TabbedSectionTypes.PRODUCTS_IN_THIS_POST:
                tabbedContent = this.props.post.products;
                break;
            case TabbedSectionTypes.YOU_MAY_ALSO_LIKE:
                tabbedContent = this.props.relatedProducts;
                break;
        }
        this.setState({ tabbedContent, section });
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
            />
        </div>);
    }
}
