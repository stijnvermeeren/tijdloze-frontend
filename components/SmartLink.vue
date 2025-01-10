<template lang="pug">
span(:class='{bold: isBold}')
  song-link(v-if='song' :song='song')
  artist-link(v-else-if='artist' :artist='artist' :text='input')
  year-link(v-else-if='year' :year='year')
  year-link(v-else-if='yearShort' :year='yearShort' short)
  span(v-else) {{input}}
</template>

<script setup>
import Artist from "../orm/Artist";
import Song from "../orm/Song";
import {useRootStore} from "~/stores/root";
import {useRepo} from "pinia-orm";

const props = defineProps({
  to: String
})

const isBold = computed(() => {
  return props.to.startsWith("*");
})
const input = computed(() => {
  if (props.to.startsWith("*")) {
    return props.to.substring(1).trim();
  } else {
    return props.to.trim();
  }
})

const years = computed(() => {
  return useRootStore().years;
})
const song = computed(() => {
  const songId = findSongId(input.value)
  return songId ? useRepo(Song).find(songId) : undefined
})
const year = computed(() => {
  return findYear(input.value);
})
const yearShort = computed(() => {
  return findYearShort(input.value);
})
const artist = computed(() => {
  const artistId = findArtistId(input.value)
  return artistId ? useRepo(Artist).find(artistId) : undefined
})


function findYear(input) {
  return years.value.find(year => year.yyyy.toString() === input);
}
function findYearShort(input) {
  return years.value.find(year => year._yy === input);
}
function findArtistId(input) {
  const fullNameMatches = useRootStore().artistIdsByFullName[input.toLowerCase()];
  if (fullNameMatches && fullNameMatches.length === 1) {
    return fullNameMatches[0];
  } else if (fullNameMatches && fullNameMatches.length > 1) {
    return null;
  }

  const lastNameMatches = useRootStore().artistIdsByName[input.toLowerCase()];
  if (lastNameMatches && lastNameMatches.length === 1) {
    return lastNameMatches[0];
  }

  return null;
}
function findSongId(input) {
  const titleMatches = useRootStore().songIdsByTitle[input.toLowerCase()];
  if (titleMatches && titleMatches.length === 1) {
    return titleMatches[0];
  }

  // fallback behaviour for inputs of the form "One;U2"
  const split = input.split(";");
  if (split.length === 2) {
    const title = split[0].trim();
    const artistName = split[1].trim();

    const titleMatches = useRootStore().songIdsByTitle[title.toLowerCase()];
    if (titleMatches) {
      const combinedMatches = titleMatches.filter(songId => {
        const foundSong = useRepo(Song).find(songId);
        const foundArtistId = findArtistId(artistName);
        return foundSong && foundArtistId && foundArtistId === foundSong.artistId;
      });

      if (combinedMatches.length === 1) {
        return combinedMatches[0];
      }
    }
  }

  return null;
}
</script>

<style lang="scss" scoped>
    span.bold {
        font-weight: bold;
    }
</style>
