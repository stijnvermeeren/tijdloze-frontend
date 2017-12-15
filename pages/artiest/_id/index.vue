<template>
    <div>
        <h2><img src="/images/icon/artist.png" alt="Artiest" class="icon" />{{artist.fullName}}</h2>

        <tijdloze-tabs :tabs="[{ title: 'Informatie en nummers' }, { to: `/artiest/${artist.id}/albums`, title: 'Albums' }]">
            <ul class="info">
                <li><tijdloze-country-icon :country="country" /> {{country.name}}</li>
                <li><strong>Links: </strong>
                    <span v-for="(link, index) in links">
                        <span v-if="index > 0">, </span>
                        <a :href="link.href">{{link.title}}</a>
                    </span>
                </li>
                <li v-if="fullArtistData.notes"><em>{{fullArtistData.notes | makelinks}}</em></li>
            </ul>

            <div class="scrollbox">
                <table class="lijst">
                    <tbody>
                        <tr>
                            <th></th>
                            <th class="l">Nummer</th>
                            <th class="y">Jaar</th>
                            <th class="l">In de Tijdloze</th>
                            <th v-for="year in lastTwoYears">{{year._yy}}</th>
                        </tr>
                        <tr v-for="(song, index) in songs" :class="['highlight', 'highlight-' + index, {inCurrentList: song.possiblyInList(currentYear)}]">
                            <td>
                                <color-label :index="index" />
                            </td>
                            <td class="l">
                                <tijdloze-song :song="song" />
                            </td>
                            <td class="y">
                                {{song.releaseYear}}
                            </td>
                            <td class="l">
                                <span v-if="song.listCount()">
                                    {{song.listCount()}} {{song.listCount() > 1 ? 'noteringen' : 'notering'}}
                                    ({{inListSummary(song)}})
                                </span>
                                <span v-else>Geen top-100 noteringen</span>
                            </td>
                            <td v-for="year in lastTwoYears">
                                <tijdloze-position-change :song="song" :year="year" /> <tijdloze-position :song="song" :year="year" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <tijdloze-graph v-if="songs.find(song => song.listCount() > 0)" />
        </tijdloze-tabs>
    </div>
</template>

<script>
  import ColorLabel from "../../../components/d3/ColorLabel";
  import Graph from "../../../components/d3/Graph";
  import _ from 'lodash';

  export default {
    components: {
      ColorLabel,
      TijdlozeGraph: Graph
    },
    computed: {
      artist() {
        return this.$store.getters.artistsById[this.fullArtistData.id];
      },
      country() {
        return this.$store.getters.countriesById[this.artist.countryId];
      },
      songs() {
        return this.$store.getters.songsByArtistId(this.artist.id);
      },
      years() {
        return this.$store.getters.years;
      },
      currentYear() {
        return this.$store.getters.currentYear;
      },
      lastTwoYears() {
        return _.takeRight(this.years, 2);
      },
      links() {
        const links = [];
        const addLink = (property, title) => {
          if (this.fullArtistData[property]) {
            links.push({
              href: this.fullArtistData[property],
              title: title
            })
          }
        };

        addLink('urlOfficial', 'Officiële website');
        addLink('urlWikien', 'Wikipedia (Engels)');
        addLink('urlWikinl', 'Wikipedia (Nederlands)');
        addLink('urlAllmusic', 'AllMusic');
        return links;
      }
    },
    methods: {
      inListSummary(song) {
        const intervals = [];
        let unprocessedYears = this.years;

        while (unprocessedYears.length) {
          unprocessedYears = _.dropWhile(unprocessedYears, year => song.notInList(year));

          const interval = _.takeWhile(unprocessedYears, year => song.possiblyInList(year));
          if (interval.length) {
            intervals.push(interval);
            unprocessedYears = _.dropWhile(unprocessedYears, year => song.possiblyInList(year));
          }
        }

        const intervalSummaries = intervals.map(interval => {
          const first = _.first(interval);
          const last = _.last(interval);
          if (last.isCurrent()) {
            return `${first._yy}-...`
          } else if (first.equals(last)) {
            return first._yy
          } else {
            return `${first._yy}-${last._yy}`
          }
        });
        return intervalSummaries.join(", ");
      }
    },
    async asyncData({ params, app }) {
      return {
        fullArtistData: await app.$axios.$get(`artist/${params.id}`)
      };
    },
    head() {
      return {
        title: this.artist.fullName
      }
    }
  }
</script>

<style scoped>

</style>
