export enum ButtonVariant {
    PRIMARY = "primary",
    SECONDARY = "secondary",
    OUTLINE = "outline",
    SECONDARY_OUTLINE = "outline_secondary",
    BLANK = "blank",
    TOP = "top",
}

export enum ButtonSize {
    FIT = "fit",
    WIDE = "wide",
    SMALL = "small",
    VERY_SMALL = "very_small",
}

export interface ButtonProps {
    className?: string;
    inline?: boolean;
    variant?: ButtonVariant;
    children?: React.ReactNode;
    onClick?(): void;
}
