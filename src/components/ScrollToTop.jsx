import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll element utama ke atas (bukan window, karena layout memiliki overflow-y-auto di dalam)
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
