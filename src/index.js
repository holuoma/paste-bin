import React from "react";
import ReactDOM from "react-dom";

import AppClass from "./AppClass";
import AppFunction from "./AppFunction";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <AppFunction />
  </React.StrictMode>,
  rootElement
);
