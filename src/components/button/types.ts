export enum ButtonVariant {
    PRIMARY = "primary",
    SECONDARY = "secondary",
    OUTLINE = "outline",
}

export interface ButtonProps {
    className?: string;
    inline?: boolean;
    variant?: ButtonVariant;
    children?: React.ReactNode;
    onClick?(): void;
}
