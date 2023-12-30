import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { I18nextProvider } from "react-i18next";
import i18n from "fragments/Translations"; // Your i18n configuration file

const root = document.getElementById("app");
const reactRoot = createRoot(root);

reactRoot.render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
);
