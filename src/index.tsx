import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../src/App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthContextProvider from "./components/auth/AuthContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </StrictMode>
);
