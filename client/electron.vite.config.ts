import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ["music-metadata"],
      }),
    ],
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
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "src/preload/index.ts"),
          settings: resolve(__dirname, "src/preload/settings.ts"),
        },
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
