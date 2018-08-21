import * as React from "react";

import "./style.scss";

interface ExternalProps {
    id: string;
    labelName: string;
}

export interface InjectedProps {
    id: string;
}

interface Options {
    key?: string;
}

const asLabeled = <OriginalProps extends {}>(
    Component: React.ComponentType<OriginalProps & InjectedProps>,
) => class AsLabeled extends React.Component<OriginalProps & ExternalProps> {
    render() {
        const { id, labelName, ...props } = this.props as ExternalProps;

        return (
            <div className="labeled">
                <label htmlFor={id}>{labelName}</label>
                <Component id={id} {...props} />
            </div>
        );
    }
};

export default asLabeled;
