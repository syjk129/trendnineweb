export enum ButtonVariant {
    PRIMARY = "primary",
    SECONDARY = "secondary",
    OUTLINE = "outline",
}

export enum ButtonSize {
    FIT = "fit",
    WIDE = "wide",
    SMALL = "small",
}

export interface ButtonProps {
    className?: string;
    inline?: boolean;
    variant?: ButtonVariant;
    children?: React.ReactNode;
    onClick?(): void;
}
