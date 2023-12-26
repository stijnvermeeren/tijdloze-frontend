<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
    titleTemplate: title => {
        if (!title || title === 'tijdloze.rocks') {
            return 'tijdloze.rocks'
        } else {
            return `${title} - tijdloze.rocks`
        }
    },
    htmlAttrs: {
        lang: 'nl'
    },
    meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=480, maximum-scale=1'},
        { name: 'author', content: 'Stijn Vermeeren - contact: www.stijnvermeeren.be/contact' },
        { name: 'keywords', content: 'Tijdloze, Tijdloze 100, De Tijdloze Website, tijdloze.rocks, Tijdloos, Tijdloze100, StuBru, Studio Brussel, muziek, aller tijden, allertijden, beste' },
        { name: 'description', content: 'Statistieken en informatie over de Tijdloze 100, de allertijden-lijst van Studio Brussel' },
        { name: 'robots', content: 'all' }
    ],
    link: [
        {
            rel: 'start',
            href: 'https://tijdloze.rocks/'
        },
        {
            rel: 'icon',
            href: '/images/favicon.png',
            type: "image/x-icon"
        }
    ],
})
</script>