<template lang="pug">
div.mt-5.mb-7(v-if="url")
  div.title Wikipedia ({{language}})
  div.details(v-if="sanitizedContent")
    div Inhoud van Wikipedia met licentie #[a(href="https://creativecommons.org/licenses/by-sa/4.0/deed.nl") Creative Commons BY-SA 4.0]
    div Laatst geladen: {{wikipediaContentNl['lastUpdate']}}
  div.px-5.mt-2.wikipediaContent(v-if="sanitizedContent" v-html="sanitizedContent")
  div.px-5
    ui-external-link-btn( :href="url") Lees meer op Wikipedia
</template>

<script setup>
import sanitizeHtml from 'sanitize-html';

const props = defineProps({
  language: String,
  url: String,
})

const {data: wikipediaContentNl, error} = await useLazyFetch(
  `wikipedia/find`, useFetchOpts({
    query: {url: props.url}
  })
)

const sanitizedContent = computed(() => {
  const content = wikipediaContentNl.value?.['content']
  if (content) {
    return sanitizeHtml(content, {
      allowedTags: ['p', 'i', 'b'],
      allowedAttributes: {
        'p': ['class']
      }
    })
  }
})
</script>

<style lang="scss">
.title {
  font-weight: bold;
}

.details {
  color: #666;
  font-size: 70%;
  font-style: italic;
}

.wikipediaContent {
  color: #666;
  font-size: 90%;
}

.mw-empty-elt {
  display: none
}
</style>
