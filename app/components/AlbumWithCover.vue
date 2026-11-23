<template lang="pug">
item-with-media
  template(#media)
    album-cover(:cover="album.cover")
  template(#title)
    album-link(v-if="!plainTitle" :album="album")
    album-title.plainTitle(v-else :album="album")
  template(#subtitle)
    | album van #[artist-link(v-if="!plainArtist" :artist="album.artist")]#[span.plain(v-if="plainArtist") {{album.artist.name}}] uit {{album.releaseYear}}
</template>

<script setup lang="ts">
import type Album from "~/orm/Album";

defineProps<{
  album: Album
  plainArtist?: boolean
  plainTitle?: boolean
}>()
</script>

<style scoped>
span.plain {
  color: black;
}

.plainTitle {
  font-style: italic;
}
</style>
