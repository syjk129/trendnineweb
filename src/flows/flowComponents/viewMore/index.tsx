import * as React from "react";
import { isMobile } from "react-device-detect";

import Button from "../../../components/button";
import Spinner from "../../../components/spinner";

import "./style.scss";

interface ViewMoreProps {
    isLoading: boolean;
    onClick(): void;
}

export default function ViewMore({ isLoading, onClick }: ViewMoreProps) {
    let classes = "view-more-container";
    if (isMobile) {
        classes += " mobile";
    }

    return (
        <div className={classes}>
            {isLoading ? (
                <Spinner />
            ) : (
                <Button rounded onClick={onClick} inline>View More</Button>
            )}
        </div>
    );
}
