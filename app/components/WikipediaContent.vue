<template lang="pug">
div.mt-5.mb-7
  div.title Wikipedia ({{language}})
  template(v-if="sanitizedContent")
    div.details
      div Inhoud van Wikipedia met licentie #[a(href="https://creativecommons.org/licenses/by-sa/4.0/deed.nl") Creative Commons BY-SA 4.0]
      div Laatst geladen: {{wikipediaContent['lastUpdate']}}
    div.px-5.mt-2.wikipediaContent(v-html="sanitizedContent")
  div(v-else)
    v-progress-circular(indeterminate size="small")
  div.px-5
    ui-external-link-btn(:href="url") Lees meer op Wikipedia
</template>

<script setup>
import sanitizeHtml from 'sanitize-html';

const props = defineProps({
  language: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
})

const {data: wikipediaContent, error} = await useLazyFetch(
  `wikipedia/find`, useFetchOpts({
    query: {url: props.url}
  })
)

const sanitizedContent = computed(() => {
  const content = wikipediaContent.value?.['content']
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
