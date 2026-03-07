import { createContext, useContext, useState } from "react";
import { getLocalToday } from "../utils/dateUtils";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

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
      localStorage.setItem(key, "shown");
    }

    setToast({ type, message, link, scrollTo });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const closeToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ toast, showToast, closeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
