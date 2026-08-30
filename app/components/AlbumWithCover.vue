<template lang="pug">
item-with-media
  template(#media)
    album-cover(:cover="album.cover")
  template(#title)
    album-link(:album="album")
  template(#subtitle)
    | album van #[artist-link(v-if="!plainArtist" :artist="album.artist")]#[span(v-if="plainArtist") {{album.artist.name}}] uit {{album.releaseYear}}
</template>

<script setup lang="ts">
import type Album from "~/orm/Album";

defineProps<{
  album: Album
  plainArtist?: boolean
}>()
</script>
