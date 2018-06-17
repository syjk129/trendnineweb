import * as ArrowDown from "./icons/arrow_down.png";
import * as ArrowDownRed from "./icons/arrow_down_red.png";
import * as ArrowLeft from "./icons/arrow_left.png";
import * as ArrowRight from "./icons/arrow_right.png";
import * as ArrowUp from "./icons/arrow_up.png";
import * as ArrowUpGreen from "./icons/arrow_up_green.png";
import * as ArrowZero from "./icons/arrow_zero.png";
import * as Bag from "./icons/bag.png";
import * as Close from "./icons/close.png";
import * as Comments from "./icons/comments.png";
import * as Girl from "./icons/girl.png";
import * as Like from "./icons/like.png";
import * as LikeFilled from "./icons/like_filled.png";
import * as Menu from "./icons/menu.png";
import * as MinusClose from "./icons/minus_close.png";
import * as PlusOpen from "./icons/plus_open.png";
import * as Preview1 from "./icons/preview1.png";
import * as Preview2 from "./icons/preview2.png";
import * as Preview3 from "./icons/preview3.png";
import * as Search from "./icons/search.png";
import * as Time from "./icons/time.png";
import * as Wishlist from "./icons/wishlist.png";
import * as WishlistFilled from "./icons/wishlist_filled.png";

import { IconVariant } from "./types";

export default function getIconForVariant(variant: IconVariant) {
    switch (variant) {
        case IconVariant.ARROW_DOWN_RED:
            return ArrowDownRed;
        case IconVariant.ARROW_DOWN:
            return ArrowDown;
        case IconVariant.ARROW_LEFT:
            return ArrowLeft;
        case IconVariant.ARROW_RIGHT:
            return ArrowRight;
        case IconVariant.ARROW_UP:
            return ArrowUp;
        case IconVariant.ARROW_UP_GREEN:
            return ArrowUpGreen;
        case IconVariant.ARROW_ZERO:
            return ArrowZero;
        case IconVariant.BAG:
            return Bag;
        case IconVariant.CLOSE:
            return Close;
        case IconVariant.COMMENT:
            return Comments;
        case IconVariant.GIRL:
            return Girl;
        case IconVariant.LIKE:
            return Like;
        case IconVariant.LIKE_FILLED:
            return LikeFilled;
        case IconVariant.MENU:
            return Menu;
        case IconVariant.MINUS_CLOSE:
            return MinusClose;
        case IconVariant.PLUS_OPEN:
            return PlusOpen;
        case IconVariant.GRID_SIZE_1:
            return Preview1;
        case IconVariant.GRID_SIZE_2:
            return Preview2;
        case IconVariant.GRID_SIZE_3:
            return Preview3;
        case IconVariant.SEARCH:
            return Search;
        case IconVariant.TIME:
            return Time;
        case IconVariant.WISHLIST:
            return Wishlist;
        case IconVariant.WISHLIST_FILLED:
            return WishlistFilled;
    }
}
