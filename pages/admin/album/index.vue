<template lang="pug">
Title Admin: nieuw album
div
  h2 Nieuw album
  v-container
    v-row(dense)
      v-col
        v-text-field(v-model='fullAlbumData.title' label="Title" hide-details)
    v-row(dense)
      v-col Artist
      v-col
        admin-artist-select(v-model='fullAlbumData.artistId')
    v-row(dense)
      v-col
        v-text-field(v-model.number='fullAlbumData.releaseYear' type='number' label="Jaar" hide-details)
    v-row
      v-col
       v-btn(@click='submit' :disabled='disabled' color="blue") Toevoegen
</template>

<script setup>
definePageMeta({
  middleware: 'admin'
})

const {$api} = useNuxtApp()

const processing = ref(false)
const fullAlbumData = ref({
  title: '',
  artistId: undefined,
  releaseYear: undefined
})

const disabled = computed(() => {
  return processing.value || !fullAlbumData.value.title || !fullAlbumData.value.artistId || !fullAlbumData.value.releaseYear
})

async function submit() {
  processing.value = true;
  const data = await $api(`album`, useFetchOptsPost(fullAlbumData.value))
  await useRouter().push(`/album/${data.id}`)
}
</script>

<style lang="scss" scoped>
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
