<template lang="pug">
Title Open Data
div
  h2 Open data
  p Alle statistieken op deze website baseren zich op een database van alle Tijdloze lijsten. Deze database kan in verschillende formaten worden gedownload.

  ui-card(title="Platte database")
    template(#buttons)
      a(:href="tvsPath")
        v-btn(rounded variant="tonal" size="small")
          span Download #[strong tijdloze.tsv]
      br
      span.lastUpdate(v-if='lastUpdateTsv') Laatst gewijzigd op {{formatDate(lastUpdateTsv)}}
    p De TSV-export ("tab-separated values") is een bestand met waardes die met tabs gescheiden zijn. Dit bestand bevat een #[em platte] versie van de belangrijkste gegevens uit de database van tijdloze.rocks. Alle artiesten, albums, nummers en noteringen worden hier in één tabel samengevat. Dit bestand kan gelezen worden door programma's zoals Microsoft Excel.

    ui-alert(title="Microsoft Excel")
      | De meeste versies van Microsoft Excel kiezen een verkeerde tekencodering als je het TSV-bestand direct opent. Vooral letters met accenten worden dan verkeerd gelezen. Om het bestand wel correct te laden in Excel, kunnen we deze methode aanbevelen: #[a(href="https://support.microsoft.com/nl-nl/office/csv-utf-8-bestanden-correct-openen-in-excel-8a935af5-3416-4edd-ba7e-3dfd2bc4a032") CSV UTF-8-bestanden correct openen in Excel - Microsoft Support] (let erop expliciet "Unicode (UTF-8)" te selecteren).

  ui-card(title="Relationele database")
    template(#buttons)
      a(:href="zipPath")
        v-btn(rounded variant="tonal" size="small")
          span Download #[strong tijdloze.zip]
      br
      span.lastUpdate(v-if='lastUpdateSql') Laatst gewijzigd op {{formatDate(lastUpdateSql)}}
    p De belangrijkste tabellen (#[em artist], #[em album], #[em song], #[em list_entry]) van de database van tijdloze.rocks kunnen ook apart, als individuele TSV-bestanden, gedownload worden. Dit is ideaal voor wie de gegevens zelf in een relationele database wilt laden. Het schema van deze tabellen is hieronder afgebeeld.
    p Het ZIP-archief dat je hier kunt downloaden, bevat naast de TSV-bestanden ook nog SQL-scripts om de gegevens in een Postgres-database te laden, en een bestand #[em README.txt] met extra uitleg.
    a(href="/images/db_schema.png")
      v-img(src="/images/db_schema.png" cover)
</template>

<script setup>
let lastUpdateSql = ref()
let lastUpdateTsv = ref()

const zipPath = '/data/tijdloze.zip'
const tvsPath = '/data/tijdloze.tsv'

function formatDate(date) {
  return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`
}

onMounted(async () => {
  // I'm not sure why nextTick is needed, but I'm not the first one to run into this:
  // https://stackoverflow.com/questions/71609027
  // Maybe the root issue is this: https://github.com/nuxt/nuxt/issues/13471
  await nextTick(async () => {
    fetch(zipPath, {method: 'HEAD'}).then(result => {
      const lastModified = result?.headers?.get('last-modified')
      if (lastModified) {
        lastUpdateSql.value = new Date(lastModified);
      }
    })

    fetch(tvsPath, {method: 'HEAD'}).then(result => {
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
