import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/css/index.css";
import "../src/css/App.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import "tw-elements";
import { initTWE } from "tw-elements"; // Import tw-elements

initTWE(); // Initialize TWE globally
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
