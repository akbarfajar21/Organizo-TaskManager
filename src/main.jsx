import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { ToastProvider } from "./context/ToastContext";
import { SidebarProvider } from "./context/SidebarContext";
import { ChatProvider } from "./context/ChatContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import OneSignal initialization
import { initializeOneSignal } from "./lib/onesignal";

// Initialize OneSignal
initializeOneSignal()
  .then(() => {
    console.log("OneSignal initialized successfully");
  })
  .catch((error) => {
    console.error("OneSignal initialization failed:", error);
  });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <SidebarProvider>
            <ChatProvider>
              <ToastProvider>
                <BrowserRouter>
                  <App />
                  <ToastContainer />
                </BrowserRouter>
              </ToastProvider>
            </ChatProvider>
          </SidebarProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
