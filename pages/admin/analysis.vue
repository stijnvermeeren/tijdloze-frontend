<template lang="pug">
Title Admin: interessante feiten {{currentYear.yyyy}}
div
  h2 "Interessante feiten" {{currentYear.yyyy}}

  ui-card(title="Aanpassen")
    ui-alert
      div Link naar nummer of artiest:
        |
        code [The Chain]
        |
        | wordt
        |
        make-links(text="[The Chain]")
      div Als de titel niet eenduidig is, voeg dan de artiest toe na een puntkomma:
        |
        code [One;Metallica]
        |
        | wordt
        |
        make-links(text="[One;Metallica]")
      div Een ster in het begin maakt de link vetgedrukt:
        |
        code [*Pink Floyd]
        |
        | wordt
        |
        make-links(text="[*Pink Floyd]")
      div HTML werkt ook (gebruik voorzichtig en met mate):
        |
        code &lt;strong&gt;vet&lt;/strong&gt; &lt;em&gt;scheef&lt;/em&gt;
        |
        | wordt
        |
        make-links(text="<strong>vet</strong> <em>scheef</em>")
    div
      v-textarea(v-model='analysis' :rows="10")
    div(v-if="outOfDate")
      | Opgelet! De tekst werd reeds door een andere Admin gewijzigd!
      |
      v-btn(@click='refresh()' :disabled='refreshing') Opnieuw laden
    div
      v-btn(@click='save()' :disabled='saving') Opslaan

  ui-card(title="Preview")
    div
      .analyse
        ul
          li(v-for='text in analysisPreview')
            make-links(:text='text')
</template>

<script>
  import {useRootStore} from "~/stores/root";

  export default defineNuxtComponent({
    setup() {
      definePageMeta({
        middleware: 'admin'
      })
    },
    data() {
      return {
        refreshing: false,
        saving: false,
        interval: undefined,
        analysis: this.initialAnalysis
      }
    },
    computed: {
      outOfDate() {
        return this.lastLoadedAnalysis !== this.initialAnalysis;
      },
      analysisPreview() {
        if (this.analysis) {
          return this.analysis.split(/\r?\n/);
        } else {
          return "";
        }
      },
      currentYear() {
        return useRootStore().currentYear;
      },
      apiPath() {
        return `text/analysis_${this.currentYear.yyyy}`
      }
    },
    methods: {
      async save() {
        this.saving = true;
        const data = {
          text: this.analysis
        };
        await useApiFetchPost(this.apiPath, data);
        this.saving = false;
      },
      async refresh() {
        this.refreshing = true;
        const { data } = await useApiFetch(this.apiPath);
        this.analysis = data.value.value;
        this.initialAnalysis = data.value.value;
        this.lastLoadedAnalysis = data.value.value;
        this.refreshing = false;
      }
    },
    mounted() {
      this.interval = setInterval(async () => {
        const { data } = await useApiFetch(this.apiPath);
        this.lastLoadedAnalysis = data.value.value;
      }, 10000);
    },
    beforeDestroy() {
      if (this.interval) {
        clearInterval(this.interval);
      }
    },
    async asyncData() {
      const { data } = await useApiFetch(`text/analysis_${useRootStore().currentYear.yyyy}`);
      return {
        initialAnalysis: data.value.value,
        lastLoadedAnalysis: data.value.value
      };
    }
  })
</script>

<style lang="scss" scoped>
  div.analyse {
    font-size: 14px;
  }

  code {
    background-color: #ddd;
    margin-left: 10px;
  }
</style>
