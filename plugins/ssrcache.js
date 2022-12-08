// nuxt plugin (mode: 'server')
// From https://github.com/vuejs/vue/issues/10151#issuecomment-764882435
import Vue from 'vue'

Vue.mixin({
    created () {
        if (!!process.server && this.$options.ssrComputedCache) {
            const { computed, ssrComputedCache } = this.$options
            if (!computed) {
                return
            }

            const cachedProperties = ssrComputedCache === true ? Object.keys(computed) : ssrComputedCache
            cachedProperties.forEach(name => {
                let value
                let cached = false
                Object.defineProperty(this, name, {
                    // for repeated re-definition in dev mode, depending on runInNewContext setting
                    // (https://github.com/nuxt/nuxt.js/issues/7171)
                    configurable: true,
                    get () {
                        if (cached) {
                            return value
                        }
                        value = computed[name].apply(this)
                        cached = true
                        return value
                    }
                })
            })
        }
    }
})