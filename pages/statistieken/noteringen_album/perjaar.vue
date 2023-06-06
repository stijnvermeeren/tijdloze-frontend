<template lang="pug">
div
  .toelichting
    p
      make-links(text='Deze tabel toont welke albums in een bepaalde editie van Tijdloze veel noteringen hadden.')
  table.lijst.perEen
    tbody
      tr
        th.r Jaar
        th
          table.valueData
            tbody
              tr
                th Not.
                th.l Albums
      tr(v-for='{year, counts} in data')
        td.r
          year-link(:year='year')
        td
          table.valueData
            tbody
              tr(v-for='{count, albums} in counts')
                td {{count}}
                td.l(v-if='albums')
                  template(v-for='(album, index) in albums')
                    template(v-if='index > 0')
                      | ,
                      |
                    | #[album-link(:album='album')] (#[artist-link(:artist='album.artist')])
                td.l(v-else) /
</template>

<script>
  import _ from 'lodash'

  export default {
    props: {
      albums: Array,
      years: Array
    },
    computed: {
      data() {
        const MAX = 3;
        const MIN = 2;

        return _.reverse([...this.years]).map(year => {
          const albumsPerCount = _.groupBy(this.albums, album => {
            return album.songs.filter(song => song.position(year)).length;
          });

          const range = _.range(MAX, MIN - 1, -1);
          const counts = range.map(count => {
            return {
              count: count,
              albums: albumsPerCount[count]
            }
          });


          return {
            year: year,
            counts: counts
          };
        });
      }
    },
    head: {
      title: 'Noteringen (albums) per jaar'
    }
  }
</script>
