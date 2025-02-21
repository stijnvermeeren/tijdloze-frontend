<template lang="pug">
  wikipedia-content(:url="fullAlbumData['urlWikiNl']" language="Nederlands")
  wikipedia-content(:url="fullAlbumData['urlWikiEn']" language="Engels")
  p.links(v-if="links.length")
    | Externe links:
    template(v-for='(link, index) in links' :key='index')
      br
      ui-external-link-btn( :href="link.href") {{ link.title }}
</template>

<script setup>
const props = defineProps({
  fullAlbumData: Object
})


const links = computed(() => {
  const links = [];
  const addLink = (property, title, fn) => {
    if (!fn) {
      fn = x => x
    }

    if (props.fullAlbumData[property]) {
      links.push({
        href: fn(props.fullAlbumData[property]),
        title: title
      })
    }
  };

  addLink('urlAllMusic', 'AllMusic');
  addLink('musicbrainzId', 'MusicBrainz', id => `https://musicbrainz.org/release-group/${id}`);
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
