<template lang="pug">
  template(v-if="status === 'success'")
    wikipedia-content(v-if="fullAlbumData['urlWikiNl']" :url="fullAlbumData['urlWikiNl']" language="Nederlands")
    wikipedia-content(v-if="fullAlbumData['urlWikiEn']" :url="fullAlbumData['urlWikiEn']" language="Engels")
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
  album: {
    type: Object,
    required: true
  }
})

const {data: fullAlbumData, status} = await useLazyFetch(
  () => `album/${props.album.id}`, useFetchOpts()
)

const links = computed(() => {
  const links = [];
  const addLink = (property, title, fn) => {
    if (!fn) {
      fn = x => x
    }

    if (fullAlbumData.value?.[property]) {
      links.push({
        href: fn(fullAlbumData.value[property]),
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
