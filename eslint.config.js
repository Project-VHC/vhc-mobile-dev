module.exports = {
  root: true,
  parser: "@typescript-eslint/parser", // <-- add this
  plugins: ["@typescript-eslint", "import"], // <-- add TS plugin
  extends: [
    "expo/native",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // <-- add TS rules
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript", // <-- enable import plugin for TS
  ],
  rules: {
    // keep your image ignore
    "import/no-unresolved": [
      "error",
      {
        ignore: [
          "\\.png$",
          "\\.jpg$",
          "\\.jpeg$",
          "\\.gif$",
          "\\.webp$",
          "\\.svg$",
        ],
      },
    ],
    // (optional) if you want to turn any TS rules on/off, do it here
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"], // <-- tell import plugin to use TS parser
    },
    "import/resolver": {
      // node + ts resolver
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      typescript: {}, // <-- use the typescript resolver
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: "./tsconfig.json", // <-- only if you want rules that need type info
      },
    },
  ],
};
