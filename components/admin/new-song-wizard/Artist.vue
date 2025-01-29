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

<script setup>
import _ from "lodash";
import Album from "~/orm/Album";
import Artist from "~/orm/Artist";
import {useRepo} from "pinia-orm";

const {$api} = useNuxtApp()

const defaultArtistType = 'new'
function defaultArtistDetails() {
  return {
    name: '',
    musicbrainzId: undefined,
    countryId: undefined
  }
}

const artistType = ref(defaultArtistType)
const artistId = ref(undefined)
const artistDetails = ref(defaultArtistDetails())

const artistName = computed(() => {
  if (artistId.value) {
    return artist.value.name;
  } else {
    return artistDetails.value.name;
  }
})
const artistNew = computed(() => {
  return artistType.value === 'new';
})
const artist = computed(() => {
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

async function loadPreset(name, musicbrainzId, countryId) {
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

function preProcessArtistName(artistName) {
  let query = useSearchNormalize(artistName.toLowerCase());
  if (query.substring(0, 4) === 'the ') {
    query = artistName.substring(4);
  }
  return query;
}

async function artistMatch(artistName, artistMBId) {
  const artist = await $api(`/artist/musicbrainz/${artistMBId}`).catch(
      () => undefined
  );
  if (artist)  {
    return useRepo(Artist).find(artist.id)
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
  let payloadArtistId;
  if (artistNew.value) {
    const artist = await $api('/artist', useFetchOptsPost(artistDetails.value));
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

<style lang="scss" scoped>
  .heading {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
  }

  div.indent {
    margin-left: 20px;
    margin-bottom: 20px;
  }

  .releaseYear{
    width: 100px;
    flex-grow: 0.2;
  }
</style>
