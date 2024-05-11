 // TODO: Add sort-imports plugin

/** @typedef  {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
// /** @typedef  {import("@trivago/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  bracketSpacing: true,
  jsxSingleQuote: false,
  printWidth: 80,
  proseWrap: "always",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  plugins: [
    // "@trivago/prettier-plugin-sort-imports",
    // "prettier-plugin-astro-organize-imports",
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss",
  ],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
  // importOrder: [
  //   "^(react/(.*)$)|^(react$)|^(react-native(.*)$)",
  //   "^(astro/(.*)$)|^(astro$)",
  //   "<THIRD_PARTY_MODULES>",
  //   "",
  //   "",
  //   "^@/",
  //   "^[../]",
  //   "^[./]",
  // ],
  // importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  // importOrderTypeScriptVersion: "5.2.2",
}

export default config
