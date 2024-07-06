/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react({ include: /\.(mdx|js|jsx|ts|tsx)$/ })],
    test: {
        environment: "happy-dom",
    },
});