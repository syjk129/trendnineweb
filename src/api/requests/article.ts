export default interface ArticleRequest {
    title: string;
    caption: string;
    content: string;
    tag_list: Array<string>;
    occasion_tag_list: Array<string>;
    style_tag_list: Array<string>;
    cover_image_url: string;
    priority_level: number;
    cta_url: string;
}
