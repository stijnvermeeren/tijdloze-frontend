<template lang="pug">
Title Admin: nieuwe artiest
div
  h2 Nieuwe artiest
  v-container
    v-row(dense)
      v-col
        v-text-field(
          v-model='fullArtistData.namePrefix'
          placeholder='The / Bob / ...'
          label="Naam (prefix)"
          hide-details
        )
      v-col
        v-text-field(
          v-model='fullArtistData.name'
          placeholder='Beatles / Dylan / ...'
          label="Naam"
          hide-details
        )
    v-row(dense)
      v-col
        admin-country-input(v-model='fullArtistData.countryId')
    v-row
      v-col
       v-btn(@click='submit' :disabled='disabled' color="blue") Toevoegen
</template>


<script setup>
definePageMeta({
  middleware: 'admin'
})

const processing = ref(false)
const fullArtistData = ref({
  namePrefix: '',
  name: '',
  countryId: undefined
})

const disabled = computed(() => {
  return processing.value || !fullArtistData.value.name
})

async function submit() {
  processing.value = true;
  const {data} = await useApiFetchPost(`artist`, fullArtistData.value)
  await useRouter().push(`/artist/${data.value.id}`)
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
