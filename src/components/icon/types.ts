export enum IconVariant {
    ARROW_DOWN = "arrow-down",
    ARROW_DOWN_RED = "arrow-down-red",
    ARROW_UP = "arrow-up",
    ARROW_UP_GREEN = "arrow-up-green",
    ARROW_ZERO = "arrow-zero",
    COMMENT = "comment",
    LIKE = "like",
    LIKE_FILLED = "like-filled",
    SEARCH = "search",
    TIME = "time",
    WISHLIST = "wishlist",
    WISHLIST_FILLED = "wishlist-filled",
    GIRL = "girl",
    BAG = "bag",
}

// Update this to be key-value pair that can be accessed both ways
export const IconMap = {
    [IconVariant.ARROW_DOWN]: IconVariant.ARROW_DOWN_RED,
    [IconVariant.ARROW_DOWN_RED]: IconVariant.ARROW_DOWN,
    [IconVariant.ARROW_UP]: IconVariant.ARROW_UP_GREEN,
    [IconVariant.ARROW_UP_GREEN]: IconVariant.ARROW_UP,
    [IconVariant.ARROW_ZERO]: IconVariant.ARROW_ZERO,
    [IconVariant.COMMENT]: IconVariant.COMMENT,
    [IconVariant.LIKE]: IconVariant.LIKE_FILLED,
    [IconVariant.LIKE_FILLED]: IconVariant.LIKE,
    [IconVariant.SEARCH]: IconVariant.SEARCH,
    [IconVariant.TIME]: IconVariant.TIME,
    [IconVariant.WISHLIST]: IconVariant.WISHLIST_FILLED,
    [IconVariant.WISHLIST_FILLED]: IconVariant.WISHLIST,
    [IconVariant.GIRL]: IconVariant.GIRL,
    [IconVariant.BAG]: IconVariant.BAG,
};
