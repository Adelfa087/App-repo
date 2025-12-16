// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,

  {
    // Nur für bestimmte Dateien (hier: _layout.tsx)
    overrides: [
      {
        files: ["app/(tabs)/_layout.tsx"],
        rules: {
          "@typescript-eslint/no-unused-vars": "off",  
        },
      },
    ],
  },
]);
