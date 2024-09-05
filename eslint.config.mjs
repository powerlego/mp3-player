import url from "node:url";

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import vueEslintParser from "vue-eslint-parser";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export default tseslint.config(
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...pluginVue.configs["flat/recommended"],
    ],
    ignores: [
      "node_modules/*",
      "public/*",
      "dist/*",
      "out/*",
      ".gitignore",
      "eslint.config.mjs",
      "*.config.js",
      "*.config.mjs",
      "*.conifg.cjs",
      "*.config.ts",
    ],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2020,
      parser: tseslint.parser,
      parserOptions: {
        extraFileExtensions: [".vue"],
        project: ["tsconfig.eslint.json"],
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.es2017,
        ...globals.browser,
      },
    },
    rules: {
      "arrow-parens": ["error", "always"],
      camelcase: ["error", { properties: "always" }],
      "brace-style": ["error", "stroustrup", { allowSingleLine: true }],
      "operator-linebreak": ["error", "before", { overrides: { "?": "before", ":": "before" } }],
      curly: ["error", "all"],
      eqeqeq: ["error", "always"],
      indent: ["error", 2],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "func-call-spacing": ["error", "never"],
      "function-paren-newline": ["error", "multiline-arguments"],
      "no-lonely-if": "error",
      "no-tabs": "error",
      "no-trailing-spaces": "error",
      "multiline-ternary": ["error", "always-multiline"],
      "max-len": [
        "error",
        {
          code: 120,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      yoda: ["error", "never", { exceptRange: true }],
      "quote-props": ["error", "as-needed"],
      "no-unused-vars": "off", // ts lint will take care of it
      "no-alert": "off",
      "func-call-spacing": "error",
      "eol-last": "error",
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-undef": "off", // ts lint will take care of it
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
      "prefer-rest-params": "error",
      "prefer-template": "error",
      "template-curly-spacing": ["error", "never"],
      "comma-spacing": ["error", { before: false, after: true }],
      "comma-dangle": ["error", "always-multiline"],
      "array-callback-return": "error",
      "default-param-last": ["error"],
      "default-case-last": "error",
      "grouped-accessor-pairs": ["error", "getBeforeSet"],
      "require-await": "error",
      "sort-imports": [
        "error",
        {
          ignoreCase: true,
        },
      ],
      "@typescript-eslint/ban-ts-comment": ["error", { "ts-ignore": "allow-with-description" }],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/naming-convention": [
        "warn",
        { selector: "default", format: ["camelCase"] },
        { selector: "variable", format: ["camelCase", "UPPER_CASE"] },
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "memberLike",
          modifiers: ["private"],
          format: ["camelCase"],
          leadingUnderscore: "require",
        },
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "class", format: ["PascalCase"] },
        { selector: "interface", format: ["PascalCase"] },
        { selector: "function", format: ["camelCase", "PascalCase"] },
        { selector: "import", format: ["camelCase", "PascalCase"] },
        { selector: "enumMember", format: ["UPPER_CASE"] },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-empty-function": ["error", { allow: ["arrowFunctions"] }],
      "@typescript-eslint/no-empty-interface": ["error", { allowSingleExtends: true }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-var-requires": "off",
      "vue/require-default-prop": "off",
      "vue/multi-word-component-names": "off",
      "vue/max-len": [
        "error",
        {
          code: 120,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreHTMLAttributeValues: true,
          ignoreHTMLTextContents: true,
        },
      ],
    },
  },
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
  {
    files: ["**/*.vue"],
    ignores: ["eslint.config.mjs"],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".vue"],
        project: ["tsconfig.eslint.json"],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "max-len": "off",
    },
  }
);
