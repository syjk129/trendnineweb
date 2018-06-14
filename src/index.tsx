import * as Raven from "raven-js";
import * as React from "react";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";

import App from "./app";

Raven.config("https://db18bddd4de44973ae76f0c6c05f0b8d@sentry.io/1226672", {
    release: "0-0-0",
    environment: "development-test",
}).install();

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
