<template lang="pug">
Title Admin: nieuwe artiest
div
  h2 Nieuwe artiest
  div.flex
    div
      div.hint Voornaam
      input(v-model='fullArtistData.namePrefix' placeholder='The / Bob / ...')
    div.flexGrow
      div.hint Naam
      input(v-model='fullArtistData.name' placeholder='Beatles / Dylan / ...')
    div
      div.hint Land
      admin-country-input(v-model='fullArtistData.countryId')
  div
    button(@click='submit' :disabled='disabled') Toevoegen
</template>

<script>

export default defineNuxtComponent({
  setup() {
    definePageMeta({
      middleware: 'admin'
    })
  },
  data() {
    return {
      processing: false,
      fullArtistData: {
        namePrefix: '',
        name: '',
        countryId: undefined
      }
    }
  },
  computed: {
    disabled() {
      return this.processing || !this.fullArtistData.name
    }
  },
  methods: {
    async submit() {
      this.processing = true;
      const {data} = await useApiFetchPost(`artist`, this.fullArtistData)
      await useRouter().push(`/artiest/${data.id}`)
    }
  }
})
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
