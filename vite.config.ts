import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  // Absolute base matching the GitHub Pages URL path.
  base: "/ScienceSpire/",
  plugins: [react(), tailwindcss()],
  build: {
    // Output directly to docs/ — GitHub Pages serves this folder from the branch.
    outDir: "docs",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
