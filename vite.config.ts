import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react(),
    keycloakify({
      themeName: ["astrago", "astrago-variant-1"],
      accountThemeImplementation: "none",
      keycloakVersionTargets: {
        hasAccountTheme: false,
        "21-and-below": false,
        "23": false,
        "24": false,
        "25-and-above": "keycloak-theme.jar"
      }
    })
  ],
  build: {
    sourcemap: true
  }
});
