<template lang="pug">
Title {{year.yyyy}}
div
  h2 De Tijdloze van {{year.yyyy}}

  ui-tabs(:tabs="tabs")
    nuxt-page(:songs='songs' :year='year' :analysis='analysis' :exits="exits" :newSongs="newSongs")
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
      songs() {
        return useRootStore().listTop100(this.year);
      },
      newSongs() {
        if (this.year.previous) {
          return this.songs.filter(song => !song.position(this.year.previous));
        } else {
          return [];
        }
      },
      exits() {
        if (this.year.previous) {
          return _.sortBy(
            useRootStore().listTop100(this.year.previous).filter(song => {
              return song.notInList(this.year);
            }),
            song => song.position(this.year.previous)
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
    async asyncData() {
      const yyyyParam = useRoute().params.yyyy
      if (yyyyParam === useRootStore().currentYear.yyyy.toString()) {
        const analysisCurrentYearResponse = await $fetch(
            `text/analysis_${yyyyParam}`,
            useFetchOpts()
        ).catch(err => undefined);
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
