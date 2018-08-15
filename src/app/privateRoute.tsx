import * as React from "react";
import { Redirect, Route } from "react-router-dom";

export default function PrivateRoute({ component: Component, ...rest }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const isAuthenticated = user && user !== "undefined";

    return (
        <Route {...rest} render={(props) => (
            isAuthenticated ? <Component {...props} /> : <Redirect to="login" />
        )} />
    );
}
