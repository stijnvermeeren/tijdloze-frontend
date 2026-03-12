<template lang="pug">
div
  v-radio-group(v-model="albumId" density="compact")
    v-radio(v-for="album in candidateAlbums" :key="album.id" :value="album.id" :label="`${album.title} (${album.releaseYear})`")
    v-radio(:value="0" label="Nieuw album")
  div(v-if="albumId === 0")
    div
      v-text-field(
        v-model='albumDetails.title'
        label="Titel"
        :disabled="!!albumId"
        hide-details
      )
    div.d-flex.justify-space-between
      div
        v-text-field.releaseYear(
          v-model.number='albumDetails.releaseYear'
          label="Jaar"
          type="number"
          :disabled="!!albumId"
          hide-details
        )
      div
        v-checkbox(v-model='albumDetails.isSingle' label="Single" hide-details)
      div
        v-checkbox(v-model='albumDetails.isSoundtrack' label="Soundtrack" hide-details)
    div
      admin-musicbrainz-input(
        v-model='albumDetails.musicbrainzId'
        musicbrainz-category="release-group"
      )
</template>

<script setup lang="ts">
import Album from "~/orm/Album";
import Artist from "~/orm/Artist";
import {useRepo} from "pinia-orm";
import { sortWith, ascend } from 'ramda';

const {$api} = useNuxtApp()

interface AlbumDetails {
  title: string
  musicbrainzId?: string
  releaseYear?: number
  isSingle: boolean
  isSoundtrack: boolean
}

const props = defineProps<{
  artistId?: number
}>()

function defaultAlbumDetails(): AlbumDetails {
  return {
    title: '',
    musicbrainzId: undefined,
    releaseYear: undefined,
    isSingle: false,
    isSoundtrack: false
  }
}

const albumId = ref<number | undefined>(undefined)
const albumDetails = ref<AlbumDetails>(defaultAlbumDetails())

const albumTitle = computed(() => {
  if (albumId.value && album.value) {
    return album.value.title;
  } else {
    return albumDetails.value.title
  }
})
const album = computed(() => {
  if (albumId.value === undefined) {
    return undefined
  }
  return useRepo(Album).find(albumId.value);
})
const albumValid = computed(() => {
  if (!albumId.value) {
    return !!albumDetails.value.title && !!albumDetails.value.releaseYear;
  } else {
    return true;
  }
})


watch(() => props.artistId, () => {
  if (albumId.value && album.value?.artistId !== props.artistId) {
    albumId.value = 0;
  }
})

const candidateAlbums = computed(() => {
  if (!props.artistId) {
    return [];
  }

  const artist = useRepo(Artist).with('albums').find(props.artistId);
  if (artist) {
    return sortWith([
      ascend((album: Album) => album.releaseYear),
      ascend((album: Album) => album.title)
    ], artist.albums)
  } else {
    return [];
  }
})

async function loadPreset(title: string, musicbrainzId: string | undefined, year: number | undefined, isSingle: boolean, isSoundtrack: boolean) {
  const matchedAlbum = props.artistId
      ? await albumMatch(props.artistId, title, year, musicbrainzId)
      : undefined;

  albumDetails.value.title = title;
  albumDetails.value.musicbrainzId = musicbrainzId;
  albumDetails.value.releaseYear = year;
  albumDetails.value.isSingle = isSingle;
  albumDetails.value.isSoundtrack = isSoundtrack;
  if (matchedAlbum) {
    albumId.value = matchedAlbum.id;
  } else {
    albumId.value = 0;
  }
}

/*
 * An album matches if the MusicBrainz id matches, or
 * - The artist matches
 * - The release year matches
 * - The titles match (case-insensitive) where one title is allowed to have some extra words. Punctuation is
 *   ignored.
 *   E.g. "Nevermind" matches with "Nevermind (Remastered)"
 *        "Sign 'O' the Times" matches with "Sign "O" the Times"
 *        BUT "Use Your Illusion I" does not match with "Use Your Illusion II"
 */
async function albumMatch(artistId: number, albumName: string, releaseYear: number | undefined, albumMBId?: string) {
  if (albumMBId) {
    const apiAlbum = await $api<{id: number}>(`/album/musicbrainz/${albumMBId}`).catch(
        () => undefined
    );
    if (apiAlbum)  {
      return useRepo(Album).find(apiAlbum.id)
    }
  }

  function tokenize(title: string): string[] {
    return Array.from(title.toLowerCase().matchAll(/\w+/g), match => match[0] ?? '');
  }

  if (artistId && albumName && releaseYear) {
    const queryTokens = tokenize(albumName);

    return useRepo(Album).all().find((album: Album) => {
      const matchTokens = tokenize(album.title);
      const minLength = Math.min(queryTokens.length, matchTokens.length);
      return album.artistId === artistId &&
        queryTokens.slice(0, minLength).join(" ") === matchTokens.slice(0, minLength).join(" ") &&
        album.releaseYear === releaseYear;
    })
  } else {
    return undefined;
  }
}

async function submit(artistId: number) {
  let payloadAlbumId = albumId.value;
  if (!payloadAlbumId) {
    const albumData = {
      artistId: artistId,
      title: albumDetails.value.title,
      musicbrainzId: albumDetails.value.musicbrainzId,
      releaseYear: albumDetails.value.releaseYear,
      isSingle: albumDetails.value.isSingle,
      isSoundtrack: albumDetails.value.isSoundtrack,
    }
    const album = await $api<{id: number}>('/album', { method: 'POST', body: albumData });
    payloadAlbumId = album.id;
  }
  return payloadAlbumId
}

function reset() {
  albumId.value = undefined
  albumDetails.value = defaultAlbumDetails()
}

defineExpose({
  loadPreset, submit, reset, albumValid, albumTitle
})
</script>

<style scoped>
  .releaseYear{
    width: 100px;
    flex-grow: 0.2;
  }
</style>
