<template lang="pug">
  div
    h2 Open data
    p Alle statistieken op deze website baseren zich op een database van alle Tijdloze lijsten. Deze database kan in verschillende formaten worden gedownload.

    h3 MySQL (relationele datenbank)
    p Onderstaande MySQL-export bevat de structuur en de gegevens van vier tabellen:
    ul
      li #[em artist]: alle artiesten.
      li #[em album]: alle albums, met een foreign key die naar #[em em artist] verwijst.
      li #[em song]: alle nummers, met foreign keys die naar #[em artist] en #[em album] verwijzen.
      li #[em list_entry]: alle noteringen in alle edities van de Tijdloze, met een foreign key die naar #[em song] verwijst.
    p
      a(href='/data/tijdloze.sql') Download #[strong tijdloze.sql]
      span(v-if='lastUpdateSql')  (laatst gewijzigd op {{formatDate(lastUpdateSql)}})

    h3 Tab-separated file (bv. voor Excel)
    p Onderstaande TSV-export is een bestand met waardes die met tabs gescheiden zijn. Dit bestand bevat een #[em vlakke] versie van de belangrijkste gegevens uit de bovenstaande MySQL-export. Alle artiesten, albums, nummers en noteringen werden hier dus in één tabel samengevat. Dit bestand kan gelezen worden door programma's zoals Microsoft Excel.
    p
      a(href='/data/tijdloze.tsv') Download #[strong tijdloze.tsv]
      span(v-if='lastUpdateTsv')  (laatst gewijzigd op {{formatDate(lastUpdateTsv)}})
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        lastUpdateSql: undefined,
        lastUpdateTsv: undefined
      }
    },
    methods: {
      formatDate(date) {
        return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`
      }
    },
    mounted() {
      axios.head('/data/tijdloze.sql').then(result => {
        this.lastUpdateSql = new Date(result.headers['last-modified']);
      })

      axios.head('/data/tijdloze.tsv').then(result => {
        this.lastUpdateTsv = new Date(result.headers['last-modified']);
      })
    },
    head: {
      title: "Open Data"
    }
  }
</script>
