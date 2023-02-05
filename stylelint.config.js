module.exports = {
  extends: ["stylelint-config-recommended", "stylelint-config-tailwindcss", "stylelint-config-prettier"],

  rules: {
    "block-no-empty": [true, { severity: "warning" }],
    "no-duplicate-selectors": true,
    indentation: [2, { severity: "warning" }],
    "max-line-length": [120, { severity: "warning" }],
  },
};
