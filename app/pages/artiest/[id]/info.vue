<template lang="pug">
  template(v-if="status === 'success'")
    ui-alert(v-if="fullArtistData?.notes")
      make-links(:text="fullArtistData.notes")

    p(v-if="artist.countryId")
      | Nationaliteit:
      |
      nuxt-link(:to="`/database?type=artiesten&land=${artist.countryId}`")
        strong
          country-icon(:country-id="artist.countryId" :include-name="true")
    wikipedia-content(v-if="fullArtistData?.['urlWikiNl']" :url="fullArtistData['urlWikiNl']" language="Nederlands")
    wikipedia-content(v-if="fullArtistData?.['urlWikiEn']" :url="fullArtistData['urlWikiEn']" language="Engels")
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
import type { ArtistFormData } from '~/api/contracts'
import type Artist from '~/orm/Artist'

const props = defineProps<{ artist: Artist }>()

// TODO: https://github.com/nuxt/nuxt/issues/20664#issuecomment-2453845270
const {data: fullArtistData, status} = await useApiFetchByPath<ArtistFormData>(
  () => apiEndpoints.artist.byId(props.artist.id).path, { lazy: true }
)

type ArtistLinkProperty = keyof Pick<ArtistFormData, 'urlOfficial' | 'urlAllMusic' | 'spotifyId' | 'musicbrainzId'>

const links = computed(() => {
  const links: { href: string; title: string }[] = [];
  const addLink = (property: ArtistLinkProperty, title: string, fn?: (value: string) => string) => {
    const resolved = fn ?? ((x: string) => x)
    const val = fullArtistData.value?.[property]
    if (val) {
      links.push({ href: resolved(val), title })
    }
  };

  addLink('urlOfficial', 'Officiële website');
  addLink('urlAllMusic', 'AllMusic');
  addLink('spotifyId', 'Spotify', id => `https://open.spotify.com/artist/${id}`);
  addLink('musicbrainzId', 'MusicBrainz', id => `https://musicbrainz.org/artist/${id}`);
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
