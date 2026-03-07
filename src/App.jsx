import React, { useEffect } from "react"; // Tambahkan useEffect dari react
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import MyTasks from "./pages/MyTasks";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Categories from "./pages/Categories";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Activities from "./pages/Activities";
import HelpPage from "./pages/HelpPage";
import ChatPage from "./pages/ChatPage";
import History from "./pages/History";
import { useAuth } from "./context/AuthContext";
import OneSignal from "react-onesignal";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const { user } = useAuth();

  useEffect(() => {
    const initOneSignal = async () => {
      const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
      // Gunakan pengecekan .initialized agar tidak dobel-init di React Strict Mode
      if (appId && !OneSignal.initialized) {
        try {
          await OneSignal.init({
            appId: appId,
            allowLocalhostAsSecureOrigin: true,
            notifyButton: {
              enable: false,
            },
          });
          if (user?.id) {
            await OneSignal.login(user.id);
          }
        } catch (err) {
          // Diamkan saja jika error karena masalah 'Vercel domain vs Localhost'
          if (
            err &&
            err.message &&
            typeof err.message === "string" &&
            !err.message.includes("Can only be used on")
          ) {
            console.warn("OneSignal (Dev Warning):", err.message);
          }
        }
      }
    };

    initOneSignal();
  }, []);

  useEffect(() => {
    if (import.meta.env.VITE_ONESIGNAL_APP_ID && OneSignal.initialized) {
      if (user?.id) {
        OneSignal.login(user.id).catch(() => {}); // Suppress dev mode errors
      } else {
        OneSignal.logout().catch(() => {});
      }
    }
  }, [user]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        {/* Protected Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route path="categories" element={<Categories />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="history" element={<History />} />
          <Route path="activities" element={<Activities />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="help" element={<HelpPage />} />
        </Route>
        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
