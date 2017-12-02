import * as React from "react";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";

import App from "./app";

const rootEl = document.getElementById("root");

render(
    <AppContainer>
        <App/>
    </AppContainer>,
    rootEl,
);

// Hot Module Replacement API
declare let module: { hot: any };

if (module.hot) {
    module.hot.accept("./app", () => {
        const NewApp = require("./app").default;

        render(
            <AppContainer>
                <NewApp/>
            </AppContainer>,
            rootEl,
        );
    });
}
