// prettier.config.js
module.exports = {
    plugins: [require("prettier-plugin-tailwindcss")],
    tailwindConfig: "./tailwind.config.js",

    // ...other prettier options
    tabWidth: 4,
    semi: true,
    singleQuote: false,
    trailingComma: "es5",
    arrowParens: "always",
    printWidth: 120,
    tabs: false,
    "quote-props": "as-needed",
    

};
