export enum IconVariant {
    ARROW_DOWN = "arrow-down",
    ARROW_DOWN_RED = "arrow-down-red",
    ARROW_LEFT = "arrow-left",
    ARROW_RIGHT = "arrow-right",
    ARROW_UP = "arrow-up",
    ARROW_UP_GREEN = "arrow-up-green",
    ARROW_UP_WHITE = "arrow-up-white",
    ARROW_ZERO = "arrow-zero",
    BOOKMARK = "bookmark",
    BOOKMARK_FILLED = "bookmark-filled",
    COMMENT = "comment",
    LIKE = "like",
    LIKE_FILLED = "like-filled",
    SEARCH = "search",
    TIME = "time",
    WISHLIST = "wishlist",
    WISHLIST_FILLED = "wishlist-filled",
    GIRL = "girl",
    BAG = "bag",
    CLOSE = "close",
    MENU = "menu",
    GRID_SIZE_1 = "grid-size-1",
    GRID_SIZE_2 = "grid-size-2",
    GRID_SIZE_3 = "grid-size-3",
    MINUS_CLOSE = "minus_close",
    PLUS_OPEN = "plus_open",
    SHARE = "share",
    SHARE_FILLED = "share_filled",
    BRANDING = "branding",
    MONETIZE = "monetize",
    AUTOMATED = "automated",
    ANALYTICS = "analytics",
    PROFILE = "profile",
}

export enum IconSize {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
}

// Update this to be key-value pair that can be accessed both ways
export const IconMap = {
    [IconVariant.ARROW_DOWN]: IconVariant.ARROW_UP,
    [IconVariant.ARROW_DOWN_RED]: IconVariant.ARROW_DOWN,
    [IconVariant.ARROW_LEFT]: IconVariant.ARROW_LEFT,
    [IconVariant.ARROW_RIGHT]: IconVariant.ARROW_RIGHT,
    [IconVariant.ARROW_UP]: IconVariant.ARROW_DOWN,
    [IconVariant.ARROW_UP_GREEN]: IconVariant.ARROW_UP,
    [IconVariant.ARROW_UP_WHITE]: IconVariant.ARROW_UP,
    [IconVariant.ARROW_ZERO]: IconVariant.ARROW_ZERO,
    [IconVariant.BOOKMARK]: IconVariant.BOOKMARK_FILLED,
    [IconVariant.BOOKMARK_FILLED]: IconVariant.BOOKMARK,
    [IconVariant.COMMENT]: IconVariant.COMMENT,
    [IconVariant.LIKE]: IconVariant.LIKE_FILLED,
    [IconVariant.LIKE_FILLED]: IconVariant.LIKE_FILLED,
    [IconVariant.SEARCH]: IconVariant.SEARCH,
    [IconVariant.TIME]: IconVariant.TIME,
    [IconVariant.WISHLIST]: IconVariant.WISHLIST_FILLED,
    [IconVariant.WISHLIST_FILLED]: IconVariant.WISHLIST_FILLED,
    [IconVariant.GIRL]: IconVariant.GIRL,
    [IconVariant.BAG]: IconVariant.BAG,
    [IconVariant.CLOSE]: IconVariant.MENU,
    [IconVariant.MENU]: IconVariant.CLOSE,
    [IconVariant.GRID_SIZE_1]: IconVariant.GRID_SIZE_1,
    [IconVariant.GRID_SIZE_2]: IconVariant.GRID_SIZE_2,
    [IconVariant.GRID_SIZE_3]: IconVariant.GRID_SIZE_3,
    [IconVariant.MINUS_CLOSE]: IconVariant.PLUS_OPEN,
    [IconVariant.PLUS_OPEN]: IconVariant.MINUS_CLOSE,
    [IconVariant.SHARE]: IconVariant.SHARE_FILLED,
    [IconVariant.SHARE_FILLED]: IconVariant.SHARE,
    [IconVariant.BRANDING]: IconVariant.BRANDING,
    [IconVariant.MONETIZE]: IconVariant.MONETIZE,
    [IconVariant.AUTOMATED]: IconVariant.AUTOMATED,
    [IconVariant.ANALYTICS]: IconVariant.ANALYTICS,
    [IconVariant.PROFILE]: IconVariant.PROFILE,
};

export enum SocialIconType {
    FACEBOOK = "https://www.facebook.com/trendnine/",
    TWITTER = "https://twitter.com/trendnine",
    INSTAGRAM = "https://www.instagram.com/trendnine/",
    PINTEREST = "https://www.pinterest.com/trendnine/",
    YOUTUBE = "https://www.youtube.com",
}
