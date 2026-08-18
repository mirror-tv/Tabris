import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'eslint/config'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import { configs as tsConfigs } from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

export default defineConfig(
  // ESLint recommended
  js.configs.recommended,

  // TypeScript-ESLint recommended (flat config native)
  ...tsConfigs.recommended,

  // Next.js core-web-vitals (wrapped via FlatCompat)
  ...compat.extends('next/core-web-vitals'),

  // Disable ESLint rules that conflict with Prettier (Prettier handles formatting separately)
  eslintConfigPrettier,

  // Custom rules
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@next/next/no-html-link-for-pages': 'off',
    },
  },

  // Ignore patterns
  {
    ignores: ['node_modules/', '.next/', 'out/'],
  }
)
