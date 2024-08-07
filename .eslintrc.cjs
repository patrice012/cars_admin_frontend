module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  "parser": "@typescript-eslint/parser",
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',    
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', 
    "ecmaFeatures": {
      "jsx": true
    } 
  },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    "react/prop-types": "off",
    'react/jsx-no-target-blank': 'off',
    "@typescript-eslint/explicit-module-boundary-types": "off",
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}