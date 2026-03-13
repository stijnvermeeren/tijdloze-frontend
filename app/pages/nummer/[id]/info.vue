<template lang="pug">
  template(v-if="fullSongData")
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
    wikipedia-content(v-if="fullSongData['urlWikiNl']" :url="fullSongData['urlWikiNl']" language="Nederlands")
    wikipedia-content(v-if="fullSongData['urlWikiEn']" :url="fullSongData['urlWikiEn']" language="Engels")
    p.links(v-if="links.length")
      | Externe links:
      template(v-for='(link, index) in links' :key='index')
        br
        ui-external-link-btn( :href="link.href") {{ link.title }}
  div(v-else)
    v-progress-circular(indeterminate)
</template>

<script setup lang="ts">
import type { SongFormData } from '~/api/contracts'
import type Song from '~/orm/Song'
import vocalsGenders from '~/utils/leadVocals'
import languages from '~/utils/language'

const props = defineProps<{
  fullSongData: SongFormData | null | undefined
  song: Song
}>()

type SongLinkProperty = keyof Pick<SongFormData, 'musicbrainzRecordingId' | 'musicbrainzWorkId'>

const links = computed(() => {
  const links: { href: string; title: string }[] = [];
  const addLink = (property: SongLinkProperty, title: string, fn?: (value: string) => string) => {
    const resolved = fn ?? ((x: string) => x)
    const val = props.fullSongData?.[property]
    if (val) {
      links.push({ href: resolved(val), title })
    }
  };

  addLink('musicbrainzRecordingId', 'MusicBrainz (recording)', id => `https://musicbrainz.org/recording/${id}`);
  addLink('musicbrainzWorkId', 'MusicBrainz (work)', id => `https://musicbrainz.org/work/${id}`);

  return links;
})

</script>

<style scoped>
.links {
  a {
    margin: 0 5px;
  }
}
</style>
