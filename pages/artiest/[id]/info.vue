<template lang="pug">
  ui-alert(v-if='fullArtistData.notes')
    make-links(:text='fullArtistData.notes')

  p
    | Nationaliteit:
    |
    nuxt-link(:to='`/database?type=artiesten&land=${artist.countryId}`')
      strong
        country-icon(:country-id='artist.countryId' :include-name="true")
  p.links(v-if="links.length")
    | Externe links:
    template(v-for='(link, index) in links' :key='index')
      br
      ui-external-link-btn( :href="link.href") {{ link.title }}
</template>

<script setup>
const props = defineProps({
  fullArtistData: Object,
  artist: Object
})

const links = computed(() => {
  const links = [];
  const addLink = (property, title, fn) => {
    if (!fn) {
      fn = x => x
    }

    if (props.fullArtistData[property]) {
      links.push({
        href: fn(props.fullArtistData[property]),
        title: title
      })
    }
  };

  addLink('urlOfficial', 'Officiële website');
  addLink('urlWikiEn', 'Wikipedia (Engels)');
  addLink('urlWikiNl', 'Wikipedia (Nederlands)');
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
