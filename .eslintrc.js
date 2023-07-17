/* eslint-disable */
const path = require("path");

module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "prettier",
    "plugin:import/recommended",
  ],
  plugins: ["@typescript-eslint", "prettier"],
  settings: {
    "import/ignore": ["node_modules"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".js"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: path.resolve(__dirname, "./tsconfig.json"),
        extensions: [".ts", ".js"],
      },
    },
  },
  rules: {
    "@typescript-eslint/naming-convention": "error",
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          orderImportKind: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "import/extensions": [
      "error",
      "always",
      {
        js: "never",
        ts: "never",
        mts: "never",
        mjs: "never",
      },
    ],
    "import/no-unresolved": "off",
    "prettier/prettier": "error",
    // not needed for vue 3
    "vue/no-multiple-template-root": "off",
  },
};
