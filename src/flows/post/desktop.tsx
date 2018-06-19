import autobind from "autobind-decorator";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Link } from "react-router-dom";

import { Comment, Person, Post, Product } from "../../api/models";
import { ButtonVariant, LinkButton } from "../../components/button";
import Carousel, { CarouselItem } from "../../components/carousel";
import Content from "../../components/content";
import Icon, { IconSize, IconVariant} from "../../components/icon";
import Image, { ImageFitVariant, ImageRatioVariant } from "../../components/image";
import Sidebar from "../../components/sidebar";
import Sticky from "../../components/sticky";
import ActionLinks, { ActionLinksVariant } from "../flowComponents/actions";
import Comments from "../flowComponents/comments";
import Featured from "../flowComponents/featured";
import { PostRank } from "../flowComponents/ranking";
import { ContentSection, SidebarPostProductListSection, SidebarSection } from "../flowComponents/section";
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

interface DesktopPostState {
    productTags: Array<any>;
}

export default class DesktopPost extends React.Component<DesktopPostProps, DesktopPostState> {
    state: DesktopPostState = {
        productTags: [],
    };

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

        const postProducts = post.products.map(product => ({ type: "product", content: product }));

        const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed"));

        return (
            <div className="post">
                <Sidebar>
                    {post.products.length > 0 && (
                        <SidebarPostProductListSection title="Products in this post" items={postProducts} />
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
                    {recentlyViewed &&
                        <Sticky id="recently-viewed-section" stickyClassName="sticky-sidebar-recently-viewed">
                            <SidebarPostProductListSection title="Recently Viewed" items={recentlyViewed} />
                        </Sticky>
                    }
                </Sidebar>
                <Content>
                    {post && (
                        <div className="post-content" ref="cover">
                            <Image
                                className="post-cover"
                                src={post.cover_image.original_image_url}
                                setRef={this._setImageRef}
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
                                            fit={ImageFitVariant.SCALED}
                                            imageUrl={product.image && product.image.small_image_url}
                                            redirectUrl={`/product/${product.id}`}
                                            title={product && product.brand.name}
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
                                            fit={ImageFitVariant.SCALED}
                                            imageUrl={product.image && product.image.small_image_url}
                                            redirectUrl={`/product/${product.id}`}
                                            title={product.brand && product.brand.name}
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

    private _coverImageRef: React.RefObject<HTMLDivElement>;

    @autobind
    private _setImageRef(element: Element) {
        const image = ReactDOM.findDOMNode(element);
        if (image instanceof Element) {
            const rect = image.getBoundingClientRect();

            this.setState({ productTags: this.props.post.product_tags.map(tag => ({
                product_id: tag.product_id,
                name: this.props.post.products.find(product => product.id === tag.product_id).title,
                style: {
                    left: rect.left + rect.width * tag.x_axis,
                    top: rect.top + rect.height * tag.y_axis,
                },
            }))});
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
