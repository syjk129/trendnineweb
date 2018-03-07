import * as React from "react";
import autobind from "autobind-decorator";

import Anchor, { AnchorVariant } from "../../../../components/anchor";

import "./style.scss";

interface TagFilterProps {
    active: boolean;
 }

export default class TagFilter extends React.Component<TagFilterProps> {
    render() {
        const { active } = this.props;

        return (
            <div className={`filter-content-container ${active ? "" : "hidden"}`}>
                Tag Filter
            </div>
        );
    }
}
