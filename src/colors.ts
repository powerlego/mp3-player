import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config.mjs";

const { theme } = resolveConfig(tailwindConfig);

export default theme;
