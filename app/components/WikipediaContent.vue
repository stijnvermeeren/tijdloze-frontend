<template lang="pug">
div.mt-5.mb-7
  div.title Wikipedia ({{language}})
  template(v-if="sanitizedContent")
    div.details
      div Inhoud van Wikipedia met licentie #[a(href="https://creativecommons.org/licenses/by-sa/4.0/deed.nl") Creative Commons BY-SA 4.0]
      div Laatst geladen: {{lastUpdate}}
    div.px-5.mt-2.wikipediaContent(v-html="sanitizedContent")
  div(v-else)
    v-progress-circular(indeterminate size="small")
  div.px-5
    ui-external-link-btn(:href="url") Lees meer op Wikipedia
</template>

<script setup lang="ts">
import { apiEndpoints } from '~/api/endpoints'
import sanitizeHtml from 'sanitize-html';

const props = defineProps<{
  language: string
  url: string
}>()

const {data: wikipediaContent} = await useApiFetch(
  apiEndpoints.wikipedia.find(),
  {
    query: {url: props.url},
    lazy: true,
  }
)

const lastUpdate = computed(() => useDateFormat(wikipediaContent.value?.lastUpdate, {ago: true}))

const sanitizedContent = computed(() => {
  if (wikipediaContent.value) {
    return sanitizeHtml(wikipediaContent.value.content, {
      allowedTags: ['p', 'i', 'b'],
      allowedAttributes: {
        'p': ['class']
      }
    })
  }
})
</script>

<style>
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
