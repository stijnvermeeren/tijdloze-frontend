// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import pluginVuePug from 'eslint-plugin-vue-pug'

export default withNuxt(
  ...pluginVuePug.configs['flat/recommended']
)
