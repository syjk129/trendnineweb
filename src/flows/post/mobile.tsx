import autobind from "autobind-decorator";
import * as React from "react";
import { isMobile } from "react-device-detect";

import { PostPreview } from "../../api/models";
import Carousel, { CarouselItem } from "../../components/carousel";
import { IconSize } from "../../components/icon";
import Image, { ImageFitVariant } from "../../components/image";
import ActionLinks, { ActionLinksVariant } from "../flowComponents/actions";
import Comments from "../flowComponents/comments";
import { ContentSection, TabbedSection } from "../flowComponents/section";
import Tag from "../flowComponents/tag";
import PostAuthorDetails from "./postAuthorDetails";
import ProductTag from "./productTag";
import { MobilePostProps, MobilePostState, TabbedSectionTypes } from "./types";

export default class MobilePost extends React.Component<MobilePostProps, MobilePostState> {
    state: MobilePostState = {
        section: TabbedSectionTypes.PRODUCTS_IN_THIS_POST,
        tabbedContent: this.props.post.products,
        productTags: [],
    };

    componentWillMount() {
        this._coverImageRef = React.createRef();
    }

    componentDidMount() {
        this._updateImageTags(this.props);
    }

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
                        width={post.cover_image.original_image_width}
                        height={post.cover_image.original_image_height}
                        src={post.cover_image.original_image_url}
                        setRef={this._coverImageRef}
                    />
                    {this.state.productTags.length > 0 && this.state.productTags.map(tag => (
                        <ProductTag tag={tag} />
                    ))}
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
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                </div>
                <TabbedSection
                    selected={this.state.section}
                    sections={[TabbedSectionTypes.PRODUCTS_IN_THIS_POST, TabbedSectionTypes.YOU_MAY_ALSO_LIKE]}
                    onSectionChange={this._onSectionChange}
                >
                    <Carousel>
                        {this.state.tabbedContent.map(content => (
                            this._renderTabbedContent(content)
                        ))}
                    </Carousel>
                </TabbedSection>
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

    private _coverImageRef: React.RefObject<HTMLDivElement>;

    private _updateImageTags = (props: MobilePostProps) => {
        const current = this._coverImageRef.current;
        if (current) {
            const rect = current.getBoundingClientRect();

            this.setState({ productTags: props.post.product_tags.map(tag => {
                const product = props.post.products.find(product => product.id === tag.product_id);
                return {
                    product_id: tag.product_id,
                    product_url: product && product.url,
                    name: product && product.title || "",
                    style: {
                        left: current.offsetLeft + rect.width * tag.x_axis + 15,
                        top: current.offsetTop + rect.height * tag.y_axis - 17,
                    },
                };
            })});
        }
    }

    private _renderTabbedContent = (content: any) => {
        switch (this.state.section) {
            case TabbedSectionTypes.PRODUCTS_IN_THIS_POST:
                return (
                    <div>
                        <CarouselItem
                            imageUrl={content.image && content.image.thumbnail_image_url}
                            fit={ImageFitVariant.SCALED}
                            redirectUrl={`/product/${content.id}`}
                            newWindowUrl={content.url}
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
