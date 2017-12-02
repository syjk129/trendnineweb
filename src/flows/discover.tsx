import * as React from "react";
import { match } from "react-router";

import Sidebar from "../components/sidebar";
import Content from "../components/content";

interface DiscoverProps {
    match: match<String>;
}

interface DiscoverState {
}

export default class Discover extends React.Component<DiscoverProps, DiscoverState> {
    render() {
        return (
            <div>
                <Sidebar>
                    sidebar
                </Sidebar>
                <Content>
                    {this.props.match.path}
                </Content>
            </div>
        );
    }
}
