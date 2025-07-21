import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, type PluginOption } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss() as unknown as PluginOption, react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      treeshake: false, // Disabled to avoid Rollup tree-shaking issues with complex dependencies
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          tinymce: ["@tinymce/tinymce-react", "tinymce"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
          ],
          utils: ["axios", "clsx", "date-fns", "lodash"],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
  },
  server: {
    port: 3000,
  },
  preview: {
    allowedHosts: ["dashboard.duvdu.com"],
  },
});
