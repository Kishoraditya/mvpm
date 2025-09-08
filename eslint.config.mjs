import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Disable problematic rules for deployment
      "@next/next/no-img-element": "off",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": "warn",
      "no-console": "off",
      // Allow empty catch blocks for error handling
      "no-empty": ["error", { "allowEmptyCatch": true }],
      // Allow any type for flexibility
      "@typescript-eslint/no-explicit-any": "off",
      // Disable strict prop-types checking
      "react/prop-types": "off"
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "games/**",
      "slides/**",
      "stakeholder/**",
      "stakeholder1/**",
      "temp/**"
    ],
  },
];

export default eslintConfig;
