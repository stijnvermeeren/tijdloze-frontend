<template lang="pug">
  template(v-if="status === 'success'")
    ui-alert(v-if="fullArtistData.notes")
      make-links(:text="fullArtistData.notes")

    p
      | Nationaliteit:
      |
      nuxt-link(:to="`/database?type=artiesten&land=${artist.countryId}`")
        strong
          country-icon(:country-id="artist.countryId" :include-name="true")
    wikipedia-content(v-if="fullArtistData['urlWikiNl']" :url="fullArtistData['urlWikiNl']" language="Nederlands")
    wikipedia-content(v-if="fullArtistData['urlWikiEn']" :url="fullArtistData['urlWikiEn']" language="Engels")
    p.links(v-if="links.length")
      | Externe links:
      template(v-for="(link, index) in links" :key="index")
        br
        ui-external-link-btn( :href="link.href") {{ link.title }}
  div(v-else)
    v-progress-circular(indeterminate)
</template>

<script setup>
const props = defineProps({
  artist: {
    type: Object,
    required: true
  }
})

// TODO: https://github.com/nuxt/nuxt/issues/20664#issuecomment-2453845270
const {data: fullArtistData, status} = await useLazyFetch(
    () => `artist/${props.artist.id}`, useFetchOpts()
)

const links = computed(() => {
  const links = [];
  const addLink = (property, title, fn) => {
    if (!fn) {
      fn = x => x
    }

    if (fullArtistData.value?.[property]) {
      links.push({
        href: fn(fullArtistData.value[property]),
        title: title
      })
    }
  };

  addLink('urlOfficial', 'Officiële website');
  addLink('urlAllMusic', 'AllMusic');
  addLink('spotifyId', 'Spotify', id => `https://open.spotify.com/artist/${id}`);
  addLink('musicbrainzId', 'MusicBrainz', id => `https://musicbrainz.org/artist/${id}`);
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
