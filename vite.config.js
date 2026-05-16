import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const stub = path.resolve(__dirname, "src/empty.js");

export default defineConfig({
  base: "/network-preflight-checklist/",
  plugins: [react()],
  server: { port: 5179, host: true },
  resolve: {
    alias: {
      html2canvas: stub,
      dompurify: stub,
    },
  },
});
