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
import productTag from "./productTag";

interface DesktopPostProps {
    post: Post;
    comments: Array<Comment>;
    relatedPosts: Array<Post>;
    relatedProducts: Array<Product>;
    featuredTrendnines: Array<Person>;
    likeComment(commentId: string): Promise<void>;
    unlikeComment(commentId: string): Promise<void>;
    submitComment(comment: string, parentCommentId: string): Promise<void>;
    updatePostProductTags?(postId: string, productTags: Array<any>): Promise<void>;
}

interface DesktopPostState {
    productTags: Array<any>;
    editableProductTags: Array<any>;
    isManager: boolean;
}

export default class DesktopPost extends React.Component<DesktopPostProps, DesktopPostState> {
    state: DesktopPostState = {
        productTags: [],
        editableProductTags: [],
        isManager: false,
    };

    constructor(props: DesktopPostProps) {
        super(props);

        this._coverImageRef = React.createRef();
    }

    componentDidMount() {
        this._updateImageTags();
        window.addEventListener("resize", this._updateImageTags);

        const rect = this._coverImageRef.current.getBoundingClientRect();

        // remove this later
        this._coverImageRef.current.addEventListener("click", (event) => {
            console.log(`x: ${(event.clientX - rect.left) / rect.width}`);
            console.log(`y: ${(event.clientY - rect.top) / rect.height}`);
        });
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("tn_auth_token");
        let isManager = false;
        if (user !== null && user !== "undefined" && token && token !== "undefined" ) {
            let parsedUser = JSON.parse(user);
            isManager = parsedUser["auth_level"] >= 3;
        }

        this.setState({
            editableProductTags: this.props.post.product_tags.map(tag => ({
                product_id: tag.product_id,
                name: this.props.post.products.find(product => product.id === tag.product_id).title,
                x_axis: tag.x_axis,
                y_axis: tag.y_axis,
            })),
            isManager: isManager,
        });
    }

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

        const postProducts = post.products.map(product => ({ type: "Product", content: product }));

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
                                width={post.cover_image.original_image_width}
                                height={post.cover_image.original_image_height}
                                src={post.cover_image.original_image_url}
                                setRef={this._coverImageRef}
                            />
                            {this.state.isManager && this.state.editableProductTags.length > 0 && this.state.editableProductTags.map(tag => (
                                <div>
                                    {tag.name}
                                    <input
                                        type="number"
                                        defaultValue={tag.x_axis}
                                        onChange={(e) => this._handleProductTagsChange(e, tag, true)}
                                    />
                                    <input
                                        type="number"
                                        defaultValue={tag.y_axis}
                                        onChange={(e) => this._handleProductTagsChange(e, tag, false)}
                                    />
                                </div>
                            ))}
                            {this.state.isManager && <button onClick={this._submitProductTagsChange}>
                                Update
                            </button>}
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
                                            title={product.brand && product.brand.name}
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

    private _updateImageTags = () => {
        const rect = this._coverImageRef.current.getBoundingClientRect();

        this.setState({ productTags: this.props.post.product_tags.map(tag => ({
            product_id: tag.product_id,
            name: this.props.post.products.find(product => product.id === tag.product_id).title,
            style: {
                left: rect.left + rect.width * tag.x_axis + 15,
                top: rect.top + rect.height * tag.y_axis - 17,
            },
        }))});
    }

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
                x_axis: tag.x_axis,
                y_axis: tag.y_axis,
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

    @autobind
    private _handleProductTagsChange(event, tag, is_x) {
        let product_tags = this.state.editableProductTags;
        for (let i = 0; i < product_tags.length; i++) {
            if (product_tags[i].product_id === tag.product_id) {
                if (is_x) {
                    product_tags[i].x_axis = parseFloat(event.target.value);
                } else {
                    product_tags[i].y_axis = parseFloat(event.target.value);
                }
            }
        }
        this.setState({ editableProductTags: product_tags });
    }

    @autobind
    private async _submitProductTagsChange() {
        await this.props.updatePostProductTags(this.props.post.id, this.state.editableProductTags);
        window.location.reload(false);
    }

}
