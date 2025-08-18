// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      // TODO check if the rule works correctly with https://github.com/rashfael/eslint-plugin-vue-pug
      "@typescript-eslint/no-unused-vars": "off"
    }
  }
)
