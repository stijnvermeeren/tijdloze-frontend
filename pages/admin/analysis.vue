<template lang="pug">
  div
    h2 "Interessante feiten" {{currentYear.yyyy}}
    div
      button(@click='refresh()', :disabled='refreshing') Opnieuw laden

    h3 Aanpassen
    div
      textarea(v-model='analyse')
    div
      button(@click='save()', :disabled='saving') Opslaan

    h3 Preview
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
        saving: false
      }
    },
    computed: {
      analysePreview() {
        return this.analyse.split(/\r?\n/);
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
        this.refreshing = false;
      }
    },
    async asyncData({ params, app, store }) {
      const response = await app.$axios.$get(`text/analysis_${store.getters.currentYear.yyyy}`);
      return {
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

<style lang="less" scoped>
  textarea {
    width: 100%;
    height: 160px;
    font-size: 14px;
  }

  div.analyse {
    font-size: 14px;
  }
</style>
