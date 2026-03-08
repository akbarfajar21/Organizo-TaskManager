import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <SidebarProvider>
            <ToastProvider>
              <ChatProvider>
                <BrowserRouter>
                  <App />
                  <ToastContainer
                    hideProgressBar={true}
                    toastClassName="relative flex p-4 min-h-16 rounded-2xl justify-between overflow-hidden cursor-pointer bg-white/80 backdrop-blur-xl text-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/50 dark:bg-gray-900/80 dark:text-gray-100 dark:border-gray-700/50 mb-4 transition-all duration-300 ease-out"
                    bodyClassName="text-sm font-semibold flex-1 self-center ml-2"
                  />
                </BrowserRouter>
              </ChatProvider>
            </ToastProvider>
          </SidebarProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      updateSW(true);
    }
  },
});
