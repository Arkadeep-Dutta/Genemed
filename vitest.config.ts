import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
    exclude: ["node_modules", ".next", "e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
  resolve: {
    alias: {
      // fileURLToPath (not URL#pathname) so this resolves correctly on
      // Windows too (URL#pathname leaves a leading slash before a drive
      // letter, e.g. "/C:/...", which is not a valid filesystem path).
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
