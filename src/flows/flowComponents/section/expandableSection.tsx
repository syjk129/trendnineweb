import autobind from "autobind-decorator";
import * as React from "react";

import { IconButton } from "../../../components/button";
import Icon, { IconSize, IconVariant } from "../../../components/icon";

interface ExpandableSectionProps {
    title: string;
    expanded?: boolean;
    children?: React.ReactNode;
}

interface ExpandableSectionState {
    isOpen: boolean;
}

export default class ExpandableSection extends React.Component<ExpandableSectionProps, ExpandableSectionState> {
    state: ExpandableSectionState = {
        isOpen: this.props.expanded || false,
    };

    render() {
        return (
            <div className="expandable-section">
                <div className="section-header" onClick={this._toggleOpen}>
                    <p>{this.props.title}</p>
                    <IconButton icon={IconVariant.ARROW_DOWN} size={IconSize.MEDIUM} selected={this.state.isOpen} />
                </div>
                {this.state.isOpen && this.props.children}
            </div>
        );
    }

    @autobind
    private _toggleOpen() {
        this.setState({ isOpen: !this.state.isOpen });
    }
}
