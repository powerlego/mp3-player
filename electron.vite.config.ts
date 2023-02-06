import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@": resolve("src/"),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@": resolve("src/"),
      },
    },
  },
  renderer: {
    envPrefix: "REACT_APP_",
    assetsInclude: ["src/assets/**/*"],
    resolve: {
      alias: {
        "@": resolve("src/"),
        "@renderer": resolve("src/renderer/src"),
      },
    },
    plugins: [
      react(),
      tsconfigPaths(),
      svgrPlugin({
        svgrOptions: {
          icon: true,
          svgoConfig: {
            multipass: true,
            plugins: [
              {
                name: "preset-default",
                params: {
                  overrides: {
                    removeTitle: false,
                  },
                },
              },
              {
                name: "convertStyleToAttrs",
              },
            ],
          },
        },
      }),
    ],
  },
});
