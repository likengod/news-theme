import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  ssr: {
    noExternal: ["@tanstack/router-core", "@tanstack/react-router"],
  },
  server: {
    port: 3099,
    host: true,
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
  preview: {
    port: 3099,
    host: true,
    allowedHosts: ["todaytripura.com", "www.todaytripura.com", "localhost"],
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
  build: {
    emptyOutDir: true,
    sourcemap: true,
    modulePreload: { polyfill: false },
    cssCodeSplit: true,
    cssMinify: "lightningcss",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          if (
            id.includes("node_modules/@tanstack/react-router") ||
            id.includes("node_modules/@tanstack/router-core")
          ) {
            return "vendor-tanstack-router";
          }
          if (
            id.includes("node_modules/@tanstack/react-query") ||
            id.includes("node_modules/@tanstack/query-core")
          ) {
            return "vendor-tanstack-query";
          }
          if (id.includes("node_modules/lucide-react/")) {
            return "vendor-icons";
          }
        },
      },
    },
  },

  plugins: [
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    react(),
  ],
});
