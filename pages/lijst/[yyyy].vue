<template lang="pug">
Title {{year.yyyy}}
div
  h2 De Tijdloze van {{year.yyyy}}

  ui-tabs(:tabs="tabs")
    nuxt-page(:year='year' :analysis='analysis' :exits="exits" :newSongs="newSongs")
</template>

<script>
  import _ from 'lodash';
  import analyse from '~/utils/analyse';
  import {useRootStore} from "~/stores/root";

  export default defineNuxtComponent({
    computed: {
      tabs() {
        const tabs = [{ to: `/lijst/${this.year.yyyy}`, title: 'De lijst' }]
        if (this.exits.length) {
          tabs.push({ to: `/lijst/${this.year.yyyy}/exits`, title: 'Exits', subtitle: "top 100" })
        }
        if (this.newSongs.length) {
          tabs.push({ to: `/lijst/${this.year.yyyy}/nieuw`, title: 'Nieuwkomers', subtitle: "top 100" })
        }
        if (this.analysis) {
          tabs.push({ to: `/lijst/${this.year.yyyy}/analyse`, title: 'Analyse' })
        }
        return tabs
      },
      year() {
        return useRootStore().years.find(year => year.yyyy.toString() === useRoute().params.yyyy);
      },
      top100() {
        return useRootStore().list(this.year, 100, 100);
      },
      newSongs() {
        if (this.year.previous) {
          return this.top100.filter(entry => !entry.song.position(this.year.previous));
        } else {
          return [];
        }
      },
      exits() {
        if (this.year.previous) {
          return _.sortBy(
              useRootStore().list(this.year.previous, 100, 100)
                  .filter(entry => entry.song.notInList(this.year)),
              entry => entry.song.position(this.year.previous)
          );
        } else {
          return [];
        }
      },
      analysis() {
        const item = analyse.find(item => item.yyyy === this.year.yyyy);
        if (item) {
          return item.analyse;
        } else {
          if (this.year.yyyy === useRootStore().currentYear?.yyyy && this.analysisCurrentYear) {
            return this.analysisCurrentYear.split(/\r?\n/);
          } else {
            return null;
          }
        }
      }
    },
    async asyncData({$api}) {
      const yyyyParam = useRoute().params.yyyy
      if (yyyyParam === useRootStore().currentYear.yyyy.toString()) {
        const analysisCurrentYearResponse = await $api(`text/analysis_${yyyyParam}`).catch(err => undefined);
        return {
          analysisCurrentYear: analysisCurrentYearResponse?.value ?? ''
        }
      } else {
        return {
          analysisCurrentYear: ''
        }
      }
    },
    validate() {
      return useRootStore().years.find(year => year.yyyy.toString() === useRoute().params.yyyy);
    }
  })
</script>
