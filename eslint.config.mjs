import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import pluginImport from "eslint-plugin-import";
import neostandard from "neostandard";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1️⃣ Base configs
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:tailwindcss/recommended",
    "plugin:import/recommended",
    "prettier"
  ),

  // 2️⃣ Neostandard rules
  ...neostandard(),

  // 3️⃣ Plugins/settings
  {
    plugins: {
      import: pluginImport,
    },
  },

  // 4️⃣ FINAL overrides (these always win)
  {
    rules: {
      "@stylistic/quotes": "off",
      "@stylistic/semi": "off",
      "@stylistic/jsx-quotes": "off",
      "@stylistic/space-before-function-paren": "off",
      "@stylistic/multiline-ternary": "off",
      "tailwindcss/no-custom-classname": "off",
      "no-undef": "off",

      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "object",
          ],
          "newlines-between": "always",
          pathGroups: [
            {
              pattern: "@app/**",
              group: "external",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];

export default eslintConfig;
