import * as React from "react";

import { IconButton } from "../../../components/button";
import Checkbox from "../../../components/checkbox";
import { IconSize, IconVariant } from "../../../components/icon";

interface RefineItemProps {
    name: string;
    selected?: boolean;
    children?: React.ReactNode;
    isOpen?: boolean;
    onSelect?(): void;
}

interface RefineItemState {
    isOpen: boolean;
}

export default class RefineItem extends React.Component<RefineItemProps, RefineItemState> {
    state: RefineItemState = {
        isOpen: this.props.isOpen || false,
    };

    render() {
        return (
            <div className="refine-item-container">
                <div className="refine-item">
                    <div className="refine-item-select">
                        <Checkbox
                            value={this.props.name}
                            label={this.props.name}
                            checked={this.props.selected}
                            onChange={this.props.onSelect || this._toggleOpen}
                        />
                    </div>
                    {this.props.children && (
                        <IconButton
                            noSwitch
                            onClick={this._toggleOpen}
                            selected={this.state.isOpen}
                            icon={IconVariant.ARROW_DOWN}
                            size={IconSize.SMALL}
                        />
                    )}
                </div>
                {this.props.children && this.state.isOpen && (
                    <div className="refine-item-children">
                        {this.props.children}
                    </div>
                )}
            </div>
        );
    }

    private _toggleOpen = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }
}
