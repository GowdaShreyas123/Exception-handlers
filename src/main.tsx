import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ReactQueryProvider } from "./libs/tanstack/ReactQueryProvider.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <App />
       <Toaster richColors position="top-center"  expand={true} />
    </ReactQueryProvider>
  </StrictMode>
);
