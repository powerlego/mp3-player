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
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("music-metadata")) {
              return "music-metadata";
            }
          },
        },
      },
    },
  },
  preload: {
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
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "src/preload/main.ts"),
          settings: resolve(__dirname, "src/preload/settings.ts"),
        },
        output: {
          manualChunks(id) {
            if (id.includes("music-metadata")) {
              return "music-metadata";
            }
          },
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
        "@utils": resolve("src/renderer/src/utils"),
      },
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "src/renderer/index.html"),
          settings: resolve(__dirname, "src/renderer/settings.html"),
        },
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
