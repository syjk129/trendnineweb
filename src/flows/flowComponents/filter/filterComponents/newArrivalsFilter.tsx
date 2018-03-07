import * as React from "react";
import autobind from "autobind-decorator";

import Anchor, { AnchorVariant } from "../../../../components/anchor";

import "./style.scss";

interface NewArrivalsFilterProps {
    active: boolean;
 }

export default class NewArrivalsFilter extends React.Component<NewArrivalsFilterProps> {
    render() {
        const { active } = this.props;

        return (
            <div className={`filter-content-container ${active ? "" : "hidden"}`}>
                NewArrivals Filter
            </div>
        );
    }
}
