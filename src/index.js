import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { createStore } from "redux";
import reducer from "./components/store/reducer";
import { Provider } from "react-redux";
const root = ReactDOM.createRoot(document.getElementById("root"));
const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
root.render(
  <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>
);
