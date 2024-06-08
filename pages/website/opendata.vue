<template lang="pug">
Title Open Data
div
  h2 Open data
  p Alle statistieken op deze website baseren zich op een database van alle Tijdloze lijsten. Deze database kan in verschillende formaten worden gedownload.

  ui-card(title="Tab-separated file" subtitle="Bijvoorbeeld voor Excel")
    template(#buttons)
      a(href="/data/tijdloze.tsv")
        v-btn(rounded variant="tonal" size="small")
          span Download #[strong tijdloze.tsv]
      br
      span.lastUpdate(v-if='lastUpdateTsv') Laatst gewijzigd op {{formatDate(lastUpdateTsv)}}
    p De TSV-export is een bestand met waardes die met tabs gescheiden zijn. Dit bestand bevat een #[em vlakke] versie van de belangrijkste gegevens uit de bovenstaande MySQL-export. Alle artiesten, albums, nummers en noteringen werden hier dus in één tabel samengevat. Dit bestand kan gelezen worden door programma's zoals Microsoft Excel.

  ui-card(title="PostgreSQL" subtitle="Relationele datenbank")
    template(#buttons)
      a(href="/data/tijdloze-schema-data.sql")
        v-btn(rounded variant="tonal" size="small")
          span Download #[strong tijdloze-schema-data.sql]
      br
      span.lastUpdate(v-if='lastUpdateSql') Laatst gewijzigd op {{formatDate(lastUpdateSql)}}
    p De PostgreSQL-export bevat de structuur en de gegevens van vijf tabellen:
    ul
      li #[em artist]: alle artiesten.
      li #[em album]: alle albums, met een foreign key die naar #[em em artist] verwijst.
      li #[em song]: alle nummers, met foreign keys die naar #[em artist] en #[em album] verwijzen.
      li #[em year]: alle jaren met een editie van de Tijdloze.
      li #[em list_entry]: alle noteringen in alle edities van de Tijdloze, met een foreign keys die naar #[em song] en #[em year] verwijzen.
    p Er is ook een versie van de PostgreSQL-export die alleen maar de gegevens bevat, zonder de structuur van de datenbanktabellen: #[a(href="/data/tijdloze-data.sql") tijdloze-data.sql]. Dit SQL-bestand is nuttig voor wie de datenbank al heeft opgezet, en deze met de nieuwste gegevens wilt vullen.
</template>

<script setup>
let lastUpdateSql = ref()
let lastUpdateTsv = ref()

function formatDate(date) {
  return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`
}

onMounted(async () => {
  // I'm not sure why nextTick is needed, but I'm not the first one to run into this:
  // https://stackoverflow.com/questions/71609027
  // Maybe the root issue is this: https://github.com/nuxt/nuxt/issues/13471
  await nextTick(async () => {
    fetch('/data/tijdloze-schema-data.sql', {method: 'HEAD'}).then(result => {
      const lastModified = result?.headers?.get('last-modified')
      if (lastModified) {
        lastUpdateSql.value = new Date(lastModified);
      }
    })

    fetch('/data/tijdloze.tsv', {method: 'HEAD'}).then(result => {
      const lastModified = result?.headers?.get('last-modified')
      if (lastModified) {
        lastUpdateTsv.value = new Date(lastModified);
      }
    })
  })
})
</script>

<style lang="scss" scoped>
.lastUpdate {
  font-size: 12px;
}
</style>
