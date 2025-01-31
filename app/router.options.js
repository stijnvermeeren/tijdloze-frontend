export default {
    scrollBehavior(to, from, savedPosition) {
        const nuxtApp = useNuxtApp()

        if (from.meta.noScrollDepth && to.meta.noScrollDepth && from.meta.noScrollDepth === to.meta.noScrollDepth) {
            const noScrollDepth = from.meta.noScrollDepth
            const fromParts = from.path.split('/').filter(fragment => fragment.length > 0);
            const toParts = to.path.split('/').filter(fragment => fragment.length > 0);
            if (fromParts.length >= noScrollDepth && toParts.length >= noScrollDepth) {
                const matched = fromParts.slice(0, noScrollDepth).every((fromPart, i) => {
                    return fromPart === toParts[i];
                })
                if (matched) {
                    return
                }
            }
        }

        if (savedPosition) {
            return savedPosition
        } else {
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
    },
}