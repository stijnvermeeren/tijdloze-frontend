<template lang="pug">
  div
    h2 "Interessante feiten" {{currentYear.yyyy}}

    el-card
      div.header(slot="header")
        div.title Aanpassen
      div
        textarea(v-model='analyse')
      div(v-if="outOfDate")
        | Opgelet! De tekst werd reeds door een andere Admin gewijzigd!
        |
        el-button(@click='refresh()' :disabled='refreshing') Opnieuw laden
      div
        el-button(@click='save()' :disabled='saving') Opslaan

    el-card
      div.header(slot="header")
        div.title Preview
      div
        .analyse
          ul
            li(v-for='text in analysePreview')
              tijdloze-links(:text='text')
</template>

<script>
  export default {
    name: 'users',
    data() {
      return {
        refreshing: false,
        saving: false,
        interval: undefined
      }
    },
    computed: {
      outOfDate() {
        return this.lastLoadedAnalysis !== this.initialAnalysis;
      },
      analysePreview() {
        if (this.analyse) {
          return this.analyse.split(/\r?\n/);
        } else {
          return "";
        }
      },
      currentYear() {
        return this.$store.getters.currentYear;
      }
    },
    methods: {
      async save() {
        this.saving = true;
        const data = {
          text: this.analyse
        };
        await this.$axios.$post(`text/analysis_${this.currentYear.yyyy}`, data);
        this.saving = false;
      },
      async refresh() {
        this.refreshing = true;
        const response = await this.$axios.$get(`text/analysis_${this.currentYear.yyyy}`);
        this.analyse = response.value;
        this.initialAnalysis = response.value;
        this.lastLoadedAnalysis = response.value;
        this.refreshing = false;
      }
    },
    mounted() {
      this.interval = setInterval(async () => {
        const response = await this.$axios.$get(`text/analysis_${this.currentYear.yyyy}`);
        this.lastLoadedAnalysis = response.value;
      }, 10000);
    },
    beforeDestroy() {
      if (this.interval) {
        clearInterval(this.interval);
      }
    },
    async asyncData({ params, app, store }) {
      const response = await app.$axios.$get(`text/analysis_${store.getters.currentYear.yyyy}`);
      return {
        initialAnalysis: response.value,
        lastLoadedAnalysis: response.value,
        analyse: response.value
      };
    },
    middleware: 'admin',
    head() {
      return {
        title: `Admin: interessante feiten ${this.currentYear.yyyy}`
      }
    },
  }
</script>

<style lang="scss" scoped>
  textarea {
    width: 100%;
    height: 160px;
    font-size: 14px;
  }

  div.analyse {
    font-size: 14px;
  }
</style>
