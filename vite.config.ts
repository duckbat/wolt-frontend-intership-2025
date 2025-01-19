import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  resolve: {
  },
  test: {
    coverage: {
      provider: "istanbul",
      reporter: ['text', 'lcov'], // Generate LCOV and text reports
      reportsDirectory: './coverage', // Default coverage directory
      include: ['src/**/*.{ts,tsx}'], // Files to include
      exclude: ['node_modules', 'dist'], // Files to exclude
      // reporter: ['text', 'json', 'html'],
    },
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{js,ts,tsx}"],
    exclude: ["node_modules", "dist"],
  },
});
