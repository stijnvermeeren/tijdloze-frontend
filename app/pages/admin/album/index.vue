<template lang="pug">
Title Admin: nieuw album
div
  h2 Nieuw album
  v-container
    v-row(dense)
      v-col
        v-text-field(v-model='fullAlbumData.title' label="Title" hide-details)
    v-row.align-center(dense)
      v-col
        admin-artist-select(v-model='fullAlbumData.artistId')
    v-row(dense)
      v-col
        v-text-field(v-model.number='fullAlbumData.releaseYear' type='number' label="Jaar" hide-details)
      v-col
        v-checkbox(v-model='fullAlbumData.isSingle' label="Single" hide-details)
      v-col
        v-checkbox(v-model='fullAlbumData.isSoundtrack' label="Soundtrack" hide-details)
    v-row
      v-col
       v-btn(@click='submit' :disabled='disabled' color="blue") Toevoegen
</template>

<script setup lang="ts">
import type { AlbumFormData } from '~/api/contracts'
import { apiEndpoints } from '~/api/endpoints'
const {$api} = useNuxtApp()

definePageMeta({
  middleware: 'admin'
})

type AlbumCreateDraftData = {
  title: string
  artistId?: number
  releaseYear?: number
  isSingle: boolean
  isSoundtrack: boolean
}

const processing = ref(false)
const fullAlbumData = ref<AlbumCreateDraftData>({
  title: '',
  artistId: undefined,
  releaseYear: undefined,
  isSingle: false,
  isSoundtrack: false
})

const disabled = computed(() => {
  return processing.value || !fullAlbumData.value.title || !fullAlbumData.value.artistId || !fullAlbumData.value.releaseYear
})

async function submit() {
  if (!fullAlbumData.value.artistId || !fullAlbumData.value.releaseYear) {
    return
  }

  const payload: AlbumFormData = {
    ...fullAlbumData.value,
    artistId: fullAlbumData.value.artistId,
    releaseYear: fullAlbumData.value.releaseYear
  }

  processing.value = true;
  const data = await $api(apiEndpoints.album.create(), payload)
  await useRouter().push(`/album/${data.id}`)
}
</script>

<style scoped>
  .flex {
    display: flex;
    margin:  5px 0;

    * {
      box-sizing: border-box;
    }

    >div {
      margin: 0 5px;

      &.flexGrow {
        flex-grow: 1;
      }

      div.hint {
        font-size: 60%;
        color: grey;
      }

      input {
        width: 100%;
      }
    }
  }
</style>
