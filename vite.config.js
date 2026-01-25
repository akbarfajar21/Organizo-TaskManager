import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      manifest: {
        name: "Organizo Task Manager",
        short_name: "Organizo",
        start_url: "/app",
        display: "standalone",
        background_color: "#ffffff",
        scope: "/", // Penting untuk deep linking
        icons: [
          {
            src: "/logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        // Tambahkan protocol handler untuk deep linking
        protocol_handlers: [
          {
            protocol: "web+organizo",
            url: "/reset-password?token=%s",
          },
        ],
        share_target: {
          action: "/",
          method: "GET",
          enctype: "application/x-www-form-urlencoded",
        },
      },
      registerType: "autoUpdate",
      workbox: {
        navigateFallback: "/app",
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
});
