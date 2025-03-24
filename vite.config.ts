import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["tw-elements"], // Ensure tw-elements is included in production
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
