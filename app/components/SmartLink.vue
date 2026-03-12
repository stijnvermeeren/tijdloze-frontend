<template lang="pug">
span(:class='{bold: isBold}')
  song-link(v-if='song' :song='song')
  artist-link(v-else-if='artist' :artist='artist' :text='input')
  year-link(v-else-if='year' :year='year')
  year-link(v-else-if='yearShort' :year='yearShort' short)
  span(v-else) {{input}}
</template>

<script setup lang="ts">
import type Year from "~/orm/Year";
import Artist from "../orm/Artist";
import Song from "../orm/Song";
import {useRepo} from "pinia-orm";

const props = defineProps<{
  to: string
}>()

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

const {years} = storeToRefs(useYearStore())

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

function findYear(input: string): Year | undefined {
  return years.value.find(year => year.yyyy.toString() === input);
}
function findYearShort(input: string): Year | undefined {
  return years.value.find(year => year._yy === input);
}
function findArtistId(input: string): number | null {
  const fullNameMatches = useRootStore().artistIdsByFullName[input.toLowerCase()];
  if (fullNameMatches && fullNameMatches.length === 1) {
    return fullNameMatches[0] ?? null
  } else if (fullNameMatches && fullNameMatches.length > 1) {
    return null;
  }

  const lastNameMatches = useRootStore().artistIdsByName[input.toLowerCase()];
  if (lastNameMatches && lastNameMatches.length === 1) {
    return lastNameMatches[0] ?? null
  }

  return null;
}
function findSongId(input: string): number | null {
  const titleMatches = useRootStore().songIdsByTitle[input.toLowerCase()];
  if (titleMatches && titleMatches.length === 1) {
    return titleMatches[0] ?? null
  }

  // fallback behaviour for inputs of the form "One;U2"
  const split = input.split(";");
  if (split.length === 2) {
    const [rawTitle, rawArtistName] = split
    if (!rawTitle || !rawArtistName) {
      return null
    }
    const title = rawTitle.trim();
    const artistName = rawArtistName.trim();

    const titleMatches = useRootStore().songIdsByTitle[title.toLowerCase()];
    if (titleMatches) {
      const combinedMatches = titleMatches.filter(songId => {
        const foundSong = useRepo(Song).find(songId);
        const foundArtistId = findArtistId(artistName);
        return foundSong && foundArtistId && foundArtistId === foundSong.artistId;
      });

      if (combinedMatches.length === 1) {
        return combinedMatches[0] ?? null
      }
    }
  }

  return null;
}
</script>

<style scoped>
    span.bold {
        font-weight: bold;
    }
</style>
