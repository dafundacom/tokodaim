import baseConfig from "@yopem/eslint-config/base"
import reactConfig from "@yopem/eslint-config/react"

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
  {
    rules: {
      "no-restricted-imports": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
]
