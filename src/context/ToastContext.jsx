import { createContext, useContext, useState } from "react";
import { toast as toastify } from "react-toastify";
import { getLocalToday } from "../utils/dateUtils";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toastState, setToastState] = useState(null);

  const showToast = ({
    type = "info",
    message,
    link,
    scrollTo,
    oncePerDay = false,
  }) => {
    if (oncePerDay) {
      const today = getLocalToday();
      const key = `toast-${type}-${today}`;
      if (localStorage.getItem(key)) return;
      if (typeof window !== "undefined") {
        localStorage.setItem(key, "shown");
      }
    }

    // Panggil react-toastify
    if (toastify[type]) {
      toastify[type](message);
    } else {
      toastify(message);
    }

    // Biarkan state untuk komponen lama jika ada yang mendengarkan
    setToastState({ type, message, link, scrollTo });
    setTimeout(() => {
      setToastState(null);
    }, 3000);
  };

  const closeToast = () => setToastState(null);

  return (
    <ToastContext.Provider value={{ toast: toastState, showToast, closeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
