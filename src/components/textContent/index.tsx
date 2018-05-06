import * as React from "react";

import "./style.scss";

interface TextContentProps<T extends keyof JSX.IntrinsicElements> {
    className?: string;
    htmlTag?: string;
    htmlStyle?: React.CSSProperties;
    maxLines?: number;
    children?: React.ReactNode;
    onClick?(): void;
}

function TextContent<T extends keyof JSX.IntrinsicElements>(props: TextContentProps<T>) {
    const { className, htmlTag, htmlStyle, maxLines, onClick, children } = props;

    let classes = className;
    let style = htmlStyle || {};
    if (maxLines) {
        classes += " truncated";
        style = Object.assign(style, {
          maxHeight: `${20 * maxLines}px`,
        });
    }

    return React.createElement(htmlTag || "span", {
        className: classes,
        onClick,
        style,
    }, children);
}

// Typescript's JSX support doesn't recognize returning React.ReactNode as a JSX element constructor
export default TextContent as <T extends keyof JSX.IntrinsicElements>(props: TextContentProps<T>) => JSX.Element;
