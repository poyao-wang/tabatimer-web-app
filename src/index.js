import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom";

import "./i18n";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
