import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeGlobalErrorHandlers } from "./lib/globalErrorHandlers";

// Initialize global error handlers before rendering
initializeGlobalErrorHandlers();

createRoot(document.getElementById("root")!).render(<App />);
