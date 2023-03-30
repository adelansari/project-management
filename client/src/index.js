import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { store } from "./redux/store";
import { Provider } from "react-redux";

// Create a root for rendering the React app
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component wrapped in a Redux Provider
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
