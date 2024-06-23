<template lang="pug">
div
  div.d-flex
    v-text-field.mr-4(v-model='query' @change='search' label='Artiest en titel' hide-details)
    v-btn(@click='search' :disabled='processing')
      | Zoeken op MusicBrainz
  div(v-if="requestError")
    ui-alert(type="error" title="Fout bij het zoeken in de MusicBrainz dataset.")
      div Probeer het nog eens, of voer de gegevens van het nummer manueel in.
  template(v-if="showingResults")
    div(v-if='!mbHit')
      | Geen resultaten in de MusicBrainz dataset. Controlleer de query.
</template>

<script>
  export default defineNuxtComponent({
    props: {
      initialQuery: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        query: this.initialQuery,
        processing: false,
        showingResults: false,
        mbHit: undefined,
        requestError: false
      }
    },
    watch: {
      initialQuery(newQuery) {
        this.query = newQuery;
        if (newQuery) {
          this.search();
        } else {
          this.showingResults = false
          this.mbHit = undefined
        }
      }
    },
    methods: {
      async search() {
        this.mbHit = undefined;
        this.showingResults = false;
        this.processing = true;

        const {data: result, error} = await useApiFetch('/mbdata/search-query', {params: {query: this.query}})

        if (result.value) {
          this.mbHit = result.value.hit;
          if (this.mbHit) {
            this.$emit('mbHit', this.mbHit);
          }
          this.processing = false;
          this.requestError = false;
          this.showingResults = true;
        }
        if (error.value) {
          this.requestError = true;
          this.processing = false;
        }
      }
    }
  })
</script>

<style lang="scss" scoped>
  table {
    margin: 10px auto 10px 0;

    td.spotify {
      max-width: 300px;
      padding-right: 10px;
    }

    td.details {
      font-size: 75%;
    }
  }
</style>
