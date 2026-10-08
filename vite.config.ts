import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  server: {
    port: 3099,
    host: true,
  },
  preview: {
    port: 3099,
    host: true,
    allowedHosts: ["todaytripura.com", "www.todaytripura.com", "localhost"],
  },
  build: {
    emptyOutDir: true,
    sourcemap: true,
    modulePreload: true,
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
          // Group all Lucide icons into a single chunk instead of 14+ individual files
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-lucide";
          }
          // Group all Radix UI primitives into one chunk
          if (id.includes("node_modules/@radix-ui/")) {
            return "vendor-radix";
          }
        },
      },
    },
  },

  plugins: [
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { entry: "server" },
    }),
    react(),
  ],
});
