import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
    scrollBehavior(to, from, savedPosition) {
        const nuxtApp = useNuxtApp()
        const fromNoScrollDepth = typeof from.meta.noScrollDepth === 'number' ? from.meta.noScrollDepth : null
        const toNoScrollDepth = typeof to.meta.noScrollDepth === 'number' ? to.meta.noScrollDepth : null

        if (fromNoScrollDepth && toNoScrollDepth && fromNoScrollDepth === toNoScrollDepth) {
            const noScrollDepth = fromNoScrollDepth
            const fromParts = from.path.split('/').filter((fragment) => fragment.length > 0)
            const toParts = to.path.split('/').filter((fragment) => fragment.length > 0)
            if (fromParts.length >= noScrollDepth && toParts.length >= noScrollDepth) {
                const matched = fromParts.slice(0, noScrollDepth).every((fromPart, i) => {
                    return fromPart === toParts[i]
                })
                if (matched) {
                    return
                }
            }
        }

        if (savedPosition) {
            return savedPosition
        }

        return new Promise(async (resolve) => {
            nuxtApp.hooks.hookOnce('page:finish', async () => {
                await nextTick()
                resolve({
                    top: 0,
                    behavior: 'smooth'
                })
            })
        })
    }
}