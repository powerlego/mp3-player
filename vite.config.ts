import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import envCompatible from "vite-plugin-env-compatible";
import tsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig({
    envPrefix: "REACT_APP_",
    assetsInclude: ["src/assets/**/*"],
    
    plugins: [
        react({
            fastRefresh: true,
        }),
        envCompatible(),
        tsconfigPaths(),
        svgrPlugin({
            svgrOptions: {
                icon: true,
            },
        }),
    ],
});
