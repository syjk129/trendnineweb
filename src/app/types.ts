import { PropTypes } from "prop-types";
import * as React from "react";

export const AppContextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};

export interface AppContext {
    api: any; // TODO
    setError(error: Error): void;
    openModal(component: React.ReactNode): void;
}
