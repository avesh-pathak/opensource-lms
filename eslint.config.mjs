import nextConfig from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import reactHooks from 'eslint-plugin-react-hooks'

const eslintConfig = [
  ...nextConfig,
  ...nextTypescript,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      '.gemini/**',
      '.agent/**',
      '.agents/**',
      'dist/**',
      'build/**',
      'scripts/**',
      'fix-lint*.mjs',
    ],
  },
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      '@next/next/no-img-element': 'warn',
      'jsx-a11y/alt-text': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      'prefer-const': 'warn',
    },
  },
]

export default eslintConfig
