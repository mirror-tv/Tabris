module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:tailwindcss/recommended', // Temporarily disabled — this plugin is not yet compatible with Tailwind CSS v4 and causes rule-loading errors like “Definition for rule 'tailwindcss/classnames-order' was not found”.
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    project: [
      './tsconfig.json', // relative to this subpackage
    ],
    tsconfigRootDir: __dirname, // ensures ESLint resolves correctly
  },
  plugins: ['@typescript-eslint', 'react-refresh', 'import', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+
    // 'prettier/prettier': 'error', // Disabled — avoids VSCode or Next.js lint failing due to Prettier format issues; formatting will instead be handled automatically by Prettier on save via the VSCode extension or lint-staged.
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'],
      },
    ],
    'import/order': [
      'warn',
      {
        groups: [
          'builtin', // Node.js built-in modules (fs, path, etc.)
          'external', // External packages (react, lodash, etc.)
          'internal', // Internal project aliases (e.g., @/components)
          ['parent', 'sibling', 'index'], // Relative imports
          'object', // CommonJS imports like: import foo = require("foo")
          'type', // TypeScript type-only imports
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
}
