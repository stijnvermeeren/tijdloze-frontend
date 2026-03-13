<template lang="pug">
  template(v-if="status === 'success'")
    wikipedia-content(v-if="fullAlbumData?.['urlWikiNl']" :url="fullAlbumData['urlWikiNl']" language="Nederlands")
    wikipedia-content(v-if="fullAlbumData?.['urlWikiEn']" :url="fullAlbumData['urlWikiEn']" language="Engels")
    p.links(v-if="links.length")
      | Externe links:
      template(v-for="(link, index) in links" :key="index")
        br
        ui-external-link-btn( :href="link.href") {{ link.title }}
  div(v-else)
    v-progress-circular(indeterminate)
</template>

<script setup lang="ts">
import { apiEndpoints } from '~/api/endpoints'
import type Album from '~/orm/Album'

interface AlbumDetail {
  urlWikiNl?: string | null
  urlWikiEn?: string | null
  urlAllMusic?: string | null
  musicbrainzId?: string | null
}

const props = defineProps<{ album: Album }>()

const {data: fullAlbumData, status} = await useApiFetch(
  () => apiEndpoints.album.byId(props.album.id), { lazy: true }
)

const links = computed(() => {
  const links: { href: string; title: string }[] = [];
  const addLink = (property: keyof AlbumDetail, title: string, fn?: (value: string) => string) => {
    const resolved = fn ?? ((x: string) => x)
    const val = fullAlbumData.value?.[property]
    if (val) {
      links.push({ href: resolved(val), title })
    }
  };

  addLink('urlAllMusic', 'AllMusic');
  addLink('musicbrainzId', 'MusicBrainz', id => `https://musicbrainz.org/release-group/${id}`);
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
