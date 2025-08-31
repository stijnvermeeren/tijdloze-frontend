// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    extends: [
      'plugin:vue/vue3-recommended',
      'plugin:vue-pug/vue3-recommended'
    ]
  }
)
