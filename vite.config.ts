/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const BASE = "/one-pot-plan/";
const THEME = "#2b1d14";

// Dev mode injects CSS through <style> tags and uses a websocket for HMR, both of
// which a strict policy would block, so the policy is only added to production builds.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "font-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join("; ");

function contentSecurityPolicy(): Plugin {
  return {
    name: "content-security-policy",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(
        "<meta charset=\"UTF-8\" />",
        `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
      );
    },
  };
}

export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? BASE : "/",
  server: {
    port: 5282,
    strictPort: true,
  },
  preview: {
    port: 5282,
    strictPort: true,
  },
  plugins: [
    react(),
    contentSecurityPolicy(),
    ...(command === "build"
      ? [
          VitePWA({
            registerType: "autoUpdate",
            injectRegister: "script",
            includeAssets: ["favicon.png", "apple-touch-icon.png"],
            manifest: {
              id: BASE,
              name: "30 by Christmas: One-Pot Plan",
              short_name: "One-Pot Plan",
              description: "Dan Go's three pillars on one-pot recipes, with a daily checklist and belly-fat focus.",
              theme_color: THEME,
              background_color: THEME,
              display: "standalone",
              start_url: "./",
              scope: "./",
              icons: [
                { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
                { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
              ],
            },
            workbox: {
              globPatterns: ["**/*.{js,css,html,png,svg,webmanifest}"],
            },
          }),
        ]
      : []),
  ],
  test: {
    environment: "node",
  },
}));
