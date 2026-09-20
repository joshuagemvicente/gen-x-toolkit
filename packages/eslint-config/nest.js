import babelParser from "@babel/eslint-parser";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * ESLint configuration for the NestJS service (apps/api).
 *
 * It extends the shared base configuration and only changes what a Node
 * service needs: a parser that understands Nest's decorators, Node/Jest
 * globals, and the mechanical half of the clean-code rules documented in
 * AGENTS.md and CONTRIBUTING.md.
 *
 * `@typescript-eslint` is deliberately absent: no published release supports
 * the TypeScript version this workspace pins, so linting stays parser-only.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nestConfig = [
  ...baseConfig,
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-typescript"],
          // Nest's method/class decorators are not part of the TypeScript preset.
          plugins: [["@babel/plugin-proposal-decorators", { version: "legacy" }]],
        },
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    rules: {
      // Without a type-aware parser the core JS rules misread TypeScript:
      // `no-undef` reports type annotations as undefined identifiers, and
      // `no-unused-vars` misses imports used only in type positions.
      // `noUnusedLocals`/`noUnusedParameters` (see nestjs.json) and `tsc`
      // itself cover both soundly — see AGENTS.md.
      "no-undef": "off",
      "no-unused-vars": "off",

      // --- Clean code: keep functions and files small and readable. ---
      complexity: ["error", 10],
      "max-depth": ["error", 3],
      "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": [
        "error",
        { max: 60, skipBlankLines: true, skipComments: true },
      ],
      "max-params": ["error", 3],

      // --- Clean code: one obvious way to write each construct. ---
      curly: ["error", "all"],
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-console": ["error", { allow: ["error", "warn"] }],
      "no-else-return": "error",
      "no-param-reassign": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-const": "error",
      "prefer-template": "error",
    },
  },
  {
    // The domain and application layers are framework-agnostic by design:
    // they must not know about Nest, HTTP, schemas, or concrete adapters.
    files: ["src/modules/*/domain/**/*.ts", "src/modules/*/application/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "zod",
              message:
                "Validation belongs to the transport layer. Keep domain and application code free of schema parsers.",
            },
          ],
          patterns: [
            {
              group: ["@nestjs", "@nestjs/*"],
              message:
                "Domain and application layers must stay framework-agnostic. Inject what you need through a port instead.",
            },
            {
              group: [
                "**/infrastructure/**",
                "**/transport/**",
                "../infrastructure/*",
                "../transport/*",
                "../../infrastructure/*",
                "../../transport/*",
              ],
              message:
                "Depend on the abstract port, never on a concrete adapter or a controller.",
            },
          ],
        },
      ],
    },
  },
];
