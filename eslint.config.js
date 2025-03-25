import eslintPluginNode from 'eslint-plugin-node';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginSecurity from 'eslint-plugin-security';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Ignore patterns
  {
    ignores: ['dist', 'node_modules', 'prisma'],
  },
  // Base config for TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json', // Use your tsconfig for type-aware linting
        sourceType: 'module', // ES modules
      },
    },
    plugins: {
      node: eslintPluginNode,
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
      'simple-import-sort': eslintPluginSimpleImportSort,
      unicorn: eslintPluginUnicorn,
      security: eslintPluginSecurity,
    },
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',

      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // TypeScript-specific rules
      '@typescript-eslint/explicit-function-return-type': 'off', // Allow implicit returns
      '@typescript-eslint/no-explicit-any': 'warn', // Warn on 'any', don’t error

      // Node.js rules
      'node/no-process-env': 'error', // Enforce env handling (e.g., via env-config)

      // Relaxed rules for flexibility
      'security/detect-object-injection': 'off', // Disable noisy security rule
      'unicorn/prefer-module': 'off', // Don’t enforce module syntax
      'unicorn/no-array-reduce': 'off', // Allow reduce for flexibility

      // Import rules (no extension enforcement)
      'import/extensions': 'off',
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: ['README.md'],
        },
      ],
    },
  },
  // Turn off ESLint rules that conflict with Prettier
  eslintConfigPrettier,
];
