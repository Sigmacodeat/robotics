import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginImport from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
      "next-env.d.ts",
      // Ignore Node scripts and tests from lint to avoid TS rules on CommonJS files
      "scripts/**",
      "__tests__/**",
      "run-tests.js",
    ],
  },
  // Additional quality and a11y rules
  {
    plugins: {
      import: pluginImport,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      // Import hygiene
      "import/first": "error",
      "import/no-duplicates": "error",
      "import/newline-after-import": ["error", { count: 1 }],

      // A11y essentials
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": [
        "warn",
        {
          aspects: ["invalidHref"],
          components: ["Link", "a"],
          specialLink: ["href"],
        },
      ],
      "jsx-a11y/aria-props": "error",
    },
  },
  // Enforce layering: prevent generic layers from importing app-specific components
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    plugins: {
      import: pluginImport,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/components/*"],
              importNames: ["*"],
              message:
                "Use @components/* for shared code. Only app routes may consume @sections/* (route-specific).",
            },
          ],
        },
      ],
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/components",
              from: "./src/app/components",
              message:
                "Do not import route-specific components from src/app/components/* into generic components.",
            },
            {
              target: "./src/lib",
              from: "./src/app/components",
              message: "Do not import route-specific components from src/app/components/* into lib.",
            },
          ],
        },
      ],
    },
  },
  // JS overrides: disable TS-specific require rule for Node scripts
  {
    files: ["scripts/**/*.js", "__tests__/**/*.js", "run-tests.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-unused-vars": "off",
    },
  },
];

export default eslintConfig;
