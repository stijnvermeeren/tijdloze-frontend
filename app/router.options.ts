import type { RouterConfig } from '@nuxt/schema'
import type { RouteLocationNormalized, RouteLocationNormalizedLoaded, RouterScrollBehavior } from '#vue-router'

export default <RouterConfig>{
    scrollBehavior(
        to: RouteLocationNormalized,
        from: RouteLocationNormalizedLoaded,
        savedPosition: Parameters<RouterScrollBehavior>[2],
    ) {
        const nuxtApp = useNuxtApp()
        const fromNoScrollDepth = from.meta.noScrollDepth
        const toNoScrollDepth = to.meta.noScrollDepth

        if (fromNoScrollDepth && toNoScrollDepth && fromNoScrollDepth === toNoScrollDepth) {
            const noScrollDepth = fromNoScrollDepth
            const fromParts = from.path.split('/').filter((fragment: string) => fragment.length > 0)
            const toParts = to.path.split('/').filter((fragment: string) => fragment.length > 0)
            if (fromParts.length >= noScrollDepth && toParts.length >= noScrollDepth) {
                const matched = fromParts.slice(0, noScrollDepth).every((fromPart: string, i: number) => {
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