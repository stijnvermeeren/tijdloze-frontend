<template lang="pug">
  ui-alert(v-if='fullSongData.notes')
    make-links(:text='fullSongData.notes')

  p(v-if="song.leadVocals")
    | Lead vocals:
    |
    strong {{vocalsGenders[song.leadVocals]}}
  p(v-if="song.languageId")
    | Taal:
    |
    strong {{languages[song.languageId]}}
  p.links(v-if="links.length")
    | Externe links:
    template(v-for='(link, index) in links' :key='index')
      br
      ui-external-link-btn( :href="link.href") {{ link.title }}
  wikipedia-content(:url="fullSongData['urlWikiNl']" language="Nederlands")
  wikipedia-content(:url="fullSongData['urlWikiEn']" language="Engels")
</template>

<script setup>
import vocalsGenders from '~/utils/leadVocals'
import languages from '~/utils/language'

const props = defineProps({
  fullSongData: Object,
  song: Object
})

const links = computed(() => {
  const links = [];
  const addLink = (property, title) => {
    if (props.fullSongData[property]) {
      links.push({
        href: props.fullSongData[property],
        title: title
      })
    }
  };

  return links;
})

</script>

<style lang="scss" scoped>
.links {
  a {
    margin: 0 5px;
  }
}
</style>
