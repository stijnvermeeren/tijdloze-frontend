<template lang="pug">
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
      country-input(v-model='fullArtistData.countryId')
  div
    button(@click='submit' :disabled='disabled') Toevoegen
</template>

<script>
import CountryInput from '../../../components/admin/CountryInput'

export default {
  components: {CountryInput},
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
    submit() {
      this.processing = true;
      this.$axios.$post(`artist`, this.fullArtistData).then(result => {
        this.$router.push(`/artiest/${result.id}`);
      })
    }
  },
  middleware: 'admin',
  head() {
    return {
      title: `Admin: nieuwe artiest`
    }
  }
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
