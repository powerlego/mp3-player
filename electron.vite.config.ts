import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import svgLoader from "vite-svg-loader";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@": resolve("src/"),
      },
    },
    build: {
      minify: true,
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
      minify: true,
    },
  },
  renderer: {
    resolve: {
      alias: {
        "@": resolve("src/"),
        "@renderer": resolve("src/renderer/src"),
        "@stores": resolve("src/renderer/src/stores"),
        "@utils": resolve("src/renderer/src/utils"),
        "@components": resolve("src/renderer/src/components"),
        "@icons": resolve("src/renderer/src/assets/icons"),
        "@composables": resolve("src/renderer/src/composables"),
      },
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "src/renderer/index.html"),
          settings: resolve(__dirname, "src/renderer/settings.html"),
        },
      },
      minify: true,
    },
    plugins: [
      vue(),
      svgLoader({
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
      }),
    ],
  },
});
