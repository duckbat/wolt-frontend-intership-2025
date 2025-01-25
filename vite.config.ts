import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  resolve: {
  },
  test: {
    testTimeout: 10000, //for getLocationInput last test "slow one ;P"
    coverage: {
      enabled: true,
      provider: "istanbul",
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['node_modules', 'dist', 'src/test/**/*'],
    },
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{js,ts,tsx}"],
    exclude: ["node_modules", "dist"],
  },
});
