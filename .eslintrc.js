module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    env: {
        browser: true,
        es2021: true,
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ],
    overrides: [],
    ignorePatterns: ["node_modules/", "dist/", "build/", "coverage/", "public/", ".eslintrc.js","vitest.config.js", "tailwind.config.js", "postcss.config.js", "prettier.config.js"],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        project: ["./tsconfig.eslint.json"],
        sourceType: "module",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    plugins: ["react", "@typescript-eslint"],
    rules: {
        "arrow-parens": ["error", "always"],
        camelcase: ["error", { properties: "always" }],
        "brace-style": ["error", "stroustrup", { allowSingleLine: true }],
        "operator-linebreak": ["error", "before", { overrides: { "?": "before", ":": "before" } }],
        curly: ["error", "all"],
        eqeqeq: ["error", "always"],
        indent: ["error", 4],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "no-tabs": "error",
        "no-trailing-spaces": "error",
        "multiline-ternary": ["error", "always-multiline"],
        "max-len": ["error", { code: 120 }],
        yoda: ["error", "never", { exceptRange: true }],
        "quote-props": ["error", "as-needed"],
        "no-unused-vars": "off", // ts lint will take care of it
        "no-alert": "off",
        "func-call-spacing": "error",
        "eol-last": "error",
        "no-empty": ["error", { allowEmptyCatch: true }],
        "no-undefined": "error",
        "no-use-before-define": "off", // ts lint will take care of it
        "no-multi-assign": "error",
        "no-useless-concat": "error",
        "no-useless-return": "error",
        "no-shadow-restricted-names": "error",
        "no-useless-constructor": "warn",
        "no-constant-condition": ["error", { checkLoops: false }],
        "no-duplicate-imports": ["error", { includeExports: true }],
        "no-useless-computed-key": "error",
        "no-useless-rename": "error",
        "no-var": "error",
        "space-before-blocks": "error",
        "space-in-parens": "error",
        "space-infix-ops": "error",
        "space-unary-ops": ["error", { words: true, nonwords: false }],
        "object-shorthand": "error",
        "object-curly-spacing": ["error", "always"],
        "prefer-const": "error",
        "prefer-arrow-callback": "error",
        "template-curly-spacing": ["error", "never"],
        "react/jsx-pascal-case": ["error", { allowAllCaps: true }],
        "react/jsx-uses-react": "error",
        "@typescript-eslint/naming-convention": ["warn", { selector: "default", format: ["camelCase"] }, { selector: "variable", format: ["camelCase", "UPPER_CASE"] }, { selector: "parameter", format: ["camelCase"], leadingUnderscore: "allow" }, { selector: "memberLike", modifiers: ["private"], format: ["camelCase"], leadingUnderscore: "require" }, { selector: "typeLike", format: ["PascalCase"]  }, { selector: "class", format: ["PascalCase"] }, {selector: "interface", format: ["PascalCase"]}, {selector :"function" , format: ["camelCase", "PascalCase"]}],
    },
};