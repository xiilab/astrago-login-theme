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
      themeName: ["astrago-v2"],
      accountThemeImplementation: "none",
      keycloakVersionTargets: {
        "all-other-versions": "keycloak-theme.jar",
        "22-to-25": false,
      },
    }),
  ],
  build: {
    sourcemap: true,
  },
});
