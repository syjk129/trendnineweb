import autobind from "autobind-decorator";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Comment, Person, Post, Product } from "../../api/models";
import { ButtonVariant, LinkButton } from "../../components/button";
import Carousel, { CarouselItem } from "../../components/carousel";
import Content from "../../components/content";
import Icon, { IconSize, IconVariant} from "../../components/icon";
import Image, { ImageRatioVariant } from "../../components/image";
import Sidebar from "../../components/sidebar";
import ActionLinks, { ActionLinksVariant } from "../flowComponents/actions";
import Comments from "../flowComponents/comments";
import Featured from "../flowComponents/featured";
import { PostRank } from "../flowComponents/ranking";
import { ContentSection, SidebarSection } from "../flowComponents/section";
import Tag from "../flowComponents/tag";
import PostAuthorDetails from "./postAuthorDetails";
import ProductTag from "./productTag";

interface DesktopPostProps {
    post: Post;
    comments: Array<Comment>;
    relatedPosts: Array<Post>;
    relatedProducts: Array<Product>;
    featuredTrendnines: Array<Person>;
    likeComment(commentId: string): Promise<void>;
    unlikeComment(commentId: string): Promise<void>;
    submitComment(comment: string, parentCommentId: string): Promise<void>;
}

export default class DesktopPost extends React.Component<DesktopPostProps> {
    render() {
        const {
            post,
            comments,
            relatedPosts,
            relatedProducts,
            featuredTrendnines,
            likeComment,
            unlikeComment,
            submitComment,
        } = this.props;

        const commentsTitle = comments.length > 0 ? (
            `Comments (${comments.length})`
        )  : "Comments";

        return (
            <div className="post">
                <Sidebar>
                    {post.products.length > 0 && (
                        <SidebarSection title="Products in this post">
                            {post.products.map(product => (
                                <div className="post-card-hover-item">
                                    <LinkButton className="post-card-hover-btn" variant={ButtonVariant.SECONDARY}>
                                        <img className="post-card-hover-image" src={product.image.small_image_url} />
                                        <div className="post-card-hover-content">
                                            <p className="post-card-hover-name">
                                                {product.brand.name}
                                            </p>
                                            <p className="post-card-hover-title">
                                                {product.title}
                                            </p>
                                        </div>
                                    </LinkButton>
                                    { this._renderProductFooter(product) }
                                </div>
                            ))}
                        </SidebarSection>
                    )}
                    {post.tags.length > 0 && (
                        <SidebarSection title="Tags">
                            <div className="tag-container">
                                {post.tags.map(tag => (
                                    <Tag tag={tag} />
                                ))}
                            </div>
                        </SidebarSection>
                    )}
                    {relatedPosts.length > 0 && (
                        <SidebarSection title="You may also like">
                            <PostRank posts={relatedPosts.slice(0, 4)} hideRanks />
                        </SidebarSection>
                    )}
                </Sidebar>
                <Content>
                    {post && (
                        <div className="post-content" ref="cover">
                            <Image
                                className="post-cover"
                                src={post.cover_image.original_image_url}
                                ratio={ImageRatioVariant.POST_COVER}
                                ref={this._setImageRef}
                            />
                            {this._productTags && this._productTags.map(tag => (
                                <ProductTag tag={tag} />
                            ))}
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
                    )}
                    {post.products.length > 0 && (
                        <ContentSection title="Products in this post">
                            <Carousel>
                                {post.products.map(product => (
                                    <div>
                                        <CarouselItem
                                            imageUrl={product.image.small_image_url}
                                            redirectUrl={`/product/${product.id}`}
                                            title={product.brand.name}
                                            detail={product.title}
                                            subdetail={ this._renderProductFooter(product) }
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </ContentSection>
                    )}
                    {post.tags.length > 0 && (
                        <ContentSection title="Tags">
                            {post.tags.map(tag => (
                                <Tag tag={tag} inline />
                            ))}
                        </ContentSection>
                    )}
                    {relatedProducts && (
                        <ContentSection title="You may also like">
                            <Carousel>
                                {relatedProducts.map(product => (
                                    <div>
                                        <CarouselItem
                                            imageUrl={product.image.small_image_url}
                                            redirectUrl={`/product/${product.id}`}
                                            title={product.brand.name}
                                            detail={product.title}
                                            subdetail={ this._renderProductFooter(product) }
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </ContentSection>
                    )}
                    <ContentSection title={commentsTitle}>
                        <Comments
                            comments={comments}
                            likeComment={likeComment}
                            unlikeComment={unlikeComment}
                            submitComment={submitComment}
                        />
                    </ContentSection>
                </Content>
            </div>
        );
    }

    // private _coverImageRef: React.RefObject<HTMLDivElement>;
    private _productTags: Array<any>;

    @autobind
    private _setImageRef(element: Element) {
        const image = ReactDOM.findDOMNode(element);
        if (image instanceof Element) {
            const rect = image.getBoundingClientRect();

            this._productTags = this.props.post.product_tags.map(tag => ({
                product_id: tag.product_id,
                name: this.props.post.products.find(product => product.id === tag.product_id).title,
                style: {
                    left: rect.left + rect.width * tag.x_axis,
                    top: rect.top + rect.height * tag.y_axis,
                },
            }));
        }
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
