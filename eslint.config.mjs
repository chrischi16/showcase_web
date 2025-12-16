import { defineConfig } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
    },

    rules: {
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": ["error"],
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": ["error"],
        complexity: ["error", 10],
        "no-await-in-loop": "warn",
        "no-eval": "error",
        "no-implied-eval": "error",
        "prefer-promise-reject-errors": "warn",
    },
}]);