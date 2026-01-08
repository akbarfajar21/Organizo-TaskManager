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
import { ChatProvider } from "./context/ChatContext"; // ✅ TAMBAHKAN INI

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
                </BrowserRouter>
              </ToastProvider>
            </ChatProvider>
          </SidebarProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
