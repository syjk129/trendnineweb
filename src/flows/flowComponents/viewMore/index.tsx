import * as React from "react";

import Button from "../../../components/button";
import Spinner from "../../../components/spinner";

import "./style.scss";

interface ViewMoreProps {
    isLoading: boolean;
    onClick(): void;
}

export default function ViewMore({ isLoading, onClick }: ViewMoreProps) {
    return (
        <div className="view-more-container">
            {isLoading ? (
                <Spinner />
            ) : (
                <Button onClick={onClick} inline>View More</Button>
            )}
        </div>
    );
}
