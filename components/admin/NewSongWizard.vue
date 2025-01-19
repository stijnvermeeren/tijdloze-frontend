<template lang="pug">
div
  div
    div.heading Artiest
    div.indent
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

  div.heading Album
  div.indent
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

  div.heading Nummer
  v-container
    v-row(dense)
      v-col
        v-text-field(v-model='songDetails.title' label="Titel" hide-details)
    v-row(dense)
      v-col
        admin-language-input(v-model='songDetails.languageId')
    v-row(dense)
      v-col
        admin-lead-vocals-input(v-model='songDetails.leadVocals')
    v-row(dense)
      v-col
        admin-song-spotify-input(
          v-model="songDetails.spotifyId"
          :artist="artistName"
          :album="albumTitle"
          :title="songDetails.title"
          ref="spotify"
        )
    v-row(dense)
      v-col(v-if="existingSong")
        ui-alert(type="warning" title="Opgelet! Dit nummer is reeds in de database!")
          v-btn(@click="selectExisting()")
            | Selecteer&nbsp;
            strong {{existingSong.title}}
            | &nbsp;uit de database
  div
    v-btn(
      color="blue"
      rounded
      :disabled='!(artistValid && albumValid && songValid) || submitting'
      @click='submit()'
    ) {{buttonLabel}}
</template>

<script setup>
import _ from "lodash";
import Album from "@/orm/Album";
import Artist from "@/orm/Artist";
import {useRepo} from "pinia-orm";

const emit = defineEmits(['existingSong', 'newSong'])
const {$api} = useNuxtApp()

const spotifyRef = useTemplateRef('spotify')

const defaultArtistType = 'new'
function defaultArtistDetails() {
  return {
    name: '',
    musicbrainzId: undefined,
    countryId: undefined
  }
}
function defaultAlbumDetails() {
  return {
    title: '',
    musicbrainzId: undefined,
    releaseYear: undefined,
    isSingle: false,
    isSoundtrack: false
  }
}
function defaultSongDetails() {
  return {
    title: '',
    languageId: undefined,
    leadVocals: undefined,
    spotifyId: undefined
  }
}

const artistType = ref(defaultArtistType)
const artistId = ref(undefined)
const artistDetails = ref(defaultArtistDetails())
const albumId = ref(undefined)
const albumDetails = ref(defaultAlbumDetails())
const songDetails = ref(defaultSongDetails())
const existingSong = ref(undefined)
const submitting = ref(false)

const props = defineProps({
  preset: {
    type: Object
  },
  buttonLabel: {
    type: String,
    default: "Toevoegen"
  }
})

const artistName = computed(() => {
  if (artistId.value) {
    return artist.value.name;
  } else {
    return artistDetails.value.name;
  }
})
const albumTitle = computed(() => {
  if (albumId.value && album.value) {
    return album.value.title;
  } else {
    return albumDetails.value.title
  }
})
const artistNew = computed(() => {
  return artistType.value === 'new';
})
const album = computed(() => {
  return useRepo(Album).find(albumId.value);
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
const albumValid = computed(() => {
  if (!albumId.value) {
    return albumDetails.value.title && albumDetails.value.releaseYear;
  } else {
    return true;
  }
})
const songValid = computed(() => {
  return songDetails.value.title;
})
const candidateAlbums = computed(() => {
  if (!artistId.value || artistType.value === 'new') {
    return [];
  }

  const artist = useRepo(Artist).with('albums').find(artistId.value);
  if (artist) {
    return _.sortBy(
        artist.albums,
        [album => album.releaseYear, album => album.title]
    )
  } else {
    return [];
  }
})

watch(() => artistId, () => {
  checkAlbum();
})
watch(() => artistType, () => {
  checkAlbum();
})
watch(() => songDetails.value.spotifyId, async () => {
  existingSong.value = await loadExistingSong()
})

function selectExisting() {
  emit('existingSong', existingSong.value);
}

async function loadExistingSong() {
  if (!artistNew.value && artistId.value && songDetails.value.spotifyId) {
    const artist = useRepo(Artist)
        .withAll()
        .with('songs', q => q
            .with('artist')
            .with('secondArtist'))
        .find(artistId.value)
    if (artist) {
      for (const song of artist.songs) {
        const fullSongData = await $api(`song/${song.id}`)
        if (fullSongData) {
          if (fullSongData.spotifyId === songDetails.value.spotifyId) {
            return song
          }
        }
      }
    }
  }
}

function checkAlbum() {
  if (albumId.value && album.value?.artistId !== artistId.value) {
    albumId.value = 0;
  }
}

async function loadPreset(preset) {
  const matchedArtist = await artistMatch(preset.artistName, preset.artistMBId);
  const matchedAlbum = matchedArtist
    ? await albumMatch(matchedArtist.id, preset.albumTitle, preset.albumYear, preset.albumMBId)
    : undefined;

  artistDetails.value.name = preset.artistName;
  artistDetails.value.musicbrainzId = preset.artistMBId;
  artistDetails.value.countryId = preset.artistCountryId;
  if (matchedArtist) {
    artistType.value = 'existing';
    artistId.value = matchedArtist.id;
  } else {
    artistType.value = 'new';
    artistId.value = undefined;
  }

  albumDetails.value.title = preset.albumTitle;
  albumDetails.value.musicbrainzId = preset.albumMBId;
  albumDetails.value.releaseYear = preset.albumYear;
  albumDetails.value.isSingle = preset.albumIsSingle;
  albumDetails.value.isSoundtrack = preset.albumIsSoundtrack;
  if (album) {
    albumId.value = matchedAlbum.id;
  } else {
    albumId.value = 0;
  }

  songDetails.value.title = preset.songTitle;

  await nextTick(spotifyRef.value.search)
}

function preProcessArtistName(artistName) {
  let query = useSearchNormalize(artistName.toLowerCase());
  if (query.substring(0,4) === 'the') {
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
async function albumMatch(artistId, albumName, releaseYear, albumMBId) {
  const album = await $api(`/album/musicbrainz/${albumMBId}`).catch(
      () => undefined
  );
  if (album)  {
    return useRepo(Album).find(album.id)
  }

  function tokenize(title) {
    return [...title.toLowerCase().matchAll(/\w+/g)];
  }

  if (artistId && albumName && releaseYear) {
    const queryTokens = tokenize(albumName);

    return useRepo(Album).all().find(album => {
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

async function submit() {
  submitting.value = true;

  let payloadArtistId = undefined;
  if (artistNew.value) {
    const artistData = {
      name: artistDetails.value.name,
      countryId: artistDetails.value.countryId
    }
    const artist = await $api('/artist', useFetchOptsPost(artistData));
    payloadArtistId = artist.id;
  } else {
    payloadArtistId = artistId.value;
  }

  let payloadAlbumId = albumId.value;
  if (!payloadAlbumId) {
    const albumData = {
      artistId: payloadArtistId,
      title: albumDetails.value.title,
      releaseYear: albumDetails.value.releaseYear,
      isSingle: albumDetails.value.isSingle,
      isSoundtrack: albumDetails.value.isSoundtrack,
    }
    const album = await $api('/album', useFetchOptsPost(albumData));
    payloadAlbumId = album.id;
  }

  const songData = {
    artistId: payloadArtistId,
    albumId: payloadAlbumId,
    title: songDetails.value.title,
    languageId: songDetails.value.languageId,
    leadVocals: songDetails.value.leadVocals,
    spotifyId: songDetails.value.spotifyId
  }
  const song = await $api('/song', useFetchOptsPost(songData));

  artistType.value = defaultArtistType
  artistId.value = undefined
  artistDetails.value = defaultArtistDetails()
  albumId.value = undefined
  albumDetails.value = defaultAlbumDetails()
  songDetails.value = defaultSongDetails()
  existingSong.value = undefined
  submitting.value = false;

  emit('newSong', song);
}

defineExpose({
  loadPreset
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
