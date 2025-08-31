// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import pluginVue from 'eslint-plugin-vue'
import pluginVuePug from 'eslint-plugin-vue-pug'

export default withNuxt([
  ...pluginVue.configs['flat/recommended'],
  ...pluginVuePug.configs['flat/recommended'],
])
