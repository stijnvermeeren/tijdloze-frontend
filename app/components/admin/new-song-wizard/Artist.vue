<template lang="pug">
div
  v-btn-toggle(v-model="artistType" color="blue" density="compact")
    v-btn(value="existing") Artiest uit de database
    v-btn(value="new") Nieuwe artiest
  div(v-if="artistType === 'existing'")
    admin-artist-select(v-model='artistId')
  div(v-else)
    v-container
      v-row(dense)
        v-col
          v-text-field(
            v-model='artistDetails.name'
            label="Naam"
            placeholder='The Beatles / Bob Dylan / ...'
            hide-details
          )
      v-row(dense)
        v-col
          admin-country-input(v-model='artistDetails.countryId')
      v-row(dense)
        v-col
          admin-musicbrainz-input(
            v-model='artistDetails.musicbrainzId'
            musicbrainz-category="artist"
          )
</template>

<script setup lang="ts">
import { apiEndpoints } from '~/api/endpoints'
import Album from "~/orm/Album";
import Artist from "~/orm/Artist";
import {useRepo} from "pinia-orm";

const {$api} = useNuxtApp()

const defaultArtistType = 'new'
interface ArtistDetails {
  name: string
  musicbrainzId?: string
  countryId?: string
}

function defaultArtistDetails(): ArtistDetails {
  return {
    name: '',
    musicbrainzId: undefined,
    countryId: undefined
  }
}

const artistType = ref<'new' | 'existing'>(defaultArtistType)
const artistId = ref<number | undefined>(undefined)
const artistDetails = ref<ArtistDetails>(defaultArtistDetails())

const artistName = computed(() => {
  if (artistId.value && artist.value) {
    return artist.value.name;
  } else {
    return artistDetails.value.name;
  }
})
const artistNew = computed(() => {
  return artistType.value === 'new';
})
const artist = computed(() => {
  if (artistId.value === undefined) {
    return undefined
  }
  return useRepo(Artist).find(artistId.value);
})
const artistValid = computed(() => {
  if (artistNew.value) {
    return artistDetails.value.name;
  } else {
    return !! artistId.value;
  }
})

async function reset() {
  artistType.value = 'new'
  artistId.value = undefined
  artistDetails.value = defaultArtistDetails()
}

async function loadPreset(name: string, musicbrainzId?: string, countryId?: string) {
  const matchedArtist = await artistMatch(name, musicbrainzId);

  artistDetails.value.name = name;
  artistDetails.value.musicbrainzId = musicbrainzId;
  artistDetails.value.countryId = countryId;
  if (matchedArtist) {
    artistType.value = 'existing';
    artistId.value = matchedArtist.id;
  } else {
    artistType.value = 'new';
    artistId.value = undefined;
  }
}

function preProcessArtistName(artistName: string) {
  let query = useSearchNormalize(artistName.toLowerCase());
  if (query.substring(0, 4) === 'the ') {
    query = artistName.substring(4);
  }
  return query;
}

async function artistMatch(artistName: string, artistMBId?: string) {
  if (artistMBId) {
    const mbArtist = await $api(apiEndpoints.musicbrainz.artistById(artistMBId)).catch(
        () => undefined
    );
    if (mbArtist)  {
      return useRepo(Artist).find(mbArtist.id)
    }
  }

  if (artistName) {
    const query = preProcessArtistName(artistName);

    return useRepo(Artist).all().find(artist => {
      const matchName = preProcessArtistName(artist.name);
      return query === matchName;
    })
  } else {
    return undefined;
  }
}

async function submit() {
  let payloadArtistId: number | undefined;
  if (artistNew.value) {
    const artist = await $api(apiEndpoints.artist.create(), artistDetails.value);
    payloadArtistId = artist.id;
  } else {
    payloadArtistId = artistId.value;
  }

  return payloadArtistId
}

defineExpose({
  loadPreset, reset, submit, artistId, artistType, artistName, artistValid
})
</script>

<style scoped>
</style>
