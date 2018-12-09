<template>
  <div>
    <h2>De Tijdloze Tijdloze</h2>

    <div
      v-if="!active"
      id="toelichting"
    >
      <p><TijdlozeLinks text="Wat als je alle edities van de Tijdloze bij elkaar gooit? Wie komt er dan uit als het ultieme tijdloze Tijdloze nummer? Veel mensen willen het weten, maar het antwoord is niet zo eenvoudig. Want op welke manier geef je punten aan de nummers? Bekijk je enkel nummers die in elke Tijdloze genoteerd waren? Is het eerlijk om een nummer uit 1967 te vergelijken met een nummer uit 2001?" /></p>
      <p><TijdlozeLinks text="Op deze pagina kan je zelf met verschillende instellingen experimenteren, de Tijdloze Tijdloze wordt automatisch gegenereerd. Naargelang de instellingen zal je verschillende nummers aan kop vinden, dus we zullen hier ook geen ultieme winnaar uitroepen. Maar toch enkele algemene observaties: [Child In Time] staat in de meeste lijstjes bovenaan, samen met klassiekers als [Angie], [Stairway To Heaven] en [Bohemian Rhapsody]. De recentere jaren worden echter aangevoerd door [Smells Like Teen Spirit], [Mia], [One;Metallica] en [Creep]. Slechts 15 nummers stonden in elke Tijdloze, terwijl [Smells Like Teen Spirit] meestal het hoogste recentere nummer is." /></p>
      <p><TijdlozeLinks text="Je kan hier ook de punten per artiest laten samentellen, en zo een ranglijst van de beste Tijdloze Artiesten krijgen. Hier vind je weer de grote kleppers aan de top als [Deep Purple], [The Rolling Stones] en [Led Zeppelin]. Maar ook groepen als [The Doors], [U2], [dEUS] en [Radiohead], die geen heel hoge maar wel veel noteringen hebben, scoren hier goed. Om [Gorky], die enkel scoorde met [Mia], te vinden moet je echter naar beneden scrollen." /></p>
    </div>

    <table>
      <tbody>
        <tr>
          <th>Vergelijk:</th>
          <td>
            <select v-model="type">
              <option value="nummers">
                Nummers
              </option>
              <option value="artiesten">
                Artiesten
              </option>
              <option value="albums">
                Albums
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <th>Van:</th>
          <td>
            <select v-model="startYear">
              <option
                v-for="year in completedYears"
                :key="year.yyyy"
                :value="year.yyyy"
              >
                {{ year.yyyy }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <th>Tot:</th>
          <td>
            <select v-model="endYear">
              <option
                v-for="year in completedYears"
                :key="year.yyyy"
                :value="year.yyyy"
              >
                {{ year.yyyy }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <th />
          <td>
            <input
              type="checkbox"
              v-model="strict"
              class="ch"
            >
            Tel enkel nummers die in elke Tijdloze stonden
          </td>
        </tr>
        <tr>
          <th>Methode:</th>
          <td>
            <div>
              <input
                v-model="method"
                type="radio"
                class="ra"
                value="1"
              > Eenvoudige telling
            </div>
            <div class="noot">
              Het nummer op de eerste plaats krijgt 100 punten, de tweede 99, de derde 98, en zo verder tot de honderste die nog 1 punt krijgt... <em>Formule: punten = 101 - positie</em>.
            </div>
            <div>
              <input
                v-model="method"
                type="radio"
                class="ra"
                value="2"
              > Realistische telling
            </div>
            <div class="noot">
              Deze telling leunt dichter aan bij het aantal stemmen dat elk nummer waarschijnlijk door de jaren heen gekregen heeft. De formule hiervoor is gebaseerd op de Tijdloze van 1998. Toen was de schiftingsvraag 'hoeveel stemmen hebben alle nummers in de top 100 gekregen'. Tijdens de uitzending werden er af en toe <em>updates</em> gegeven over hoeveel stemmen sommige nummers kregen, en wat het subtotaal van de stemmen was. Een formule die grofweg het aantal stemmen per positie benadert, is <em>400 / (positie + 5)</em>. Deze formule wordt hier gebruikt.
            </div>
          </td>
        </tr>
        <tr v-if="!active">
          <th />
          <td>
            <button
              @click="submit()"
              type="submit"
            >
              Bereken Tijdloze Tijdloze
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <table
      v-if="active && type === 'nummers'"
      class="lijst perVijf"
    >
      <tbody>
        <tr>
          <th class="r" />
          <th class="a">
            <nuxt-link to="/artiesten">
              Artiest
            </nuxt-link>
          </th>
          <th>
            <nuxt-link to="/nummers">
              Nummer
            </nuxt-link>
          </th>
          <th>Score</th>
        </tr>
        <tr
          v-for="{entry, position} in songData"
          :key="entry.song.id"
        >
          <td class="r">
            {{ position }}
          </td>
          <td class="a">
            <TijdlozeArtist :artist="entry.song.artist" />
          </td>
          <td><TijdlozeSong :song="entry.song" /></td>
          <td>{{ Math.round(entry.points * 10) / 10 }}</td>
        </tr>
      </tbody>
    </table>

    <table
      v-if="active && type === 'artiesten'"
      class="lijst perVijf"
    >
      <tbody>
        <tr>
          <th class="r" />
          <th class="l">
            <nuxt-link to="/artiesten">
              Artiest
            </nuxt-link>
          </th>
          <th>Score</th>
        </tr>
        <tr
          v-for="{entry, position} in artistData"
          :key="entry.artist.id"
        >
          <td class="r">
            {{ position }}
          </td>
          <td class="l">
            <TijdlozeArtist :artist="entry.artist" />
          </td>
          <td>{{ Math.round(entry.points * 10) / 10 }}</td>
        </tr>
      </tbody>
    </table>

    <table
      v-if="active && type === 'albums'"
      class="lijst perVijf"
    >
      <tbody>
        <tr>
          <th class="r" />
          <th class="a">
            <nuxt-link to="/artiesten">
              Artiest
            </nuxt-link>
          </th>
          <th>Album</th>
          <th>Score</th>
        </tr>
        <tr
          v-for="{entry, position} in albumData"
          :key="entry.album.id"
        >
          <td class="r">
            {{ position }}
          </td>
          <td class="a">
            <TijdlozeArtist :artist="entry.artist" />
          </td>
          <td><TijdlozeAlbum :album="entry.album" /></td>
          <td>{{ Math.round(entry.points * 10) / 10 }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import _ from 'lodash';
  import ranking from '../store/ranking';

  export default {
    data() {
      return {
        active: !!this.$route.query.type,
        type: this.$route.query.type ? this.$route.query.type : "nummers",
        strict: this.$route.query.strikt ? this.$route.query.strikt === "1" : false,
        startYear: this.$route.query.start ? this.$route.query.start : _.first(this.$store.getters.completedYears).yyyy,
        endYear: this.$route.query.einde ? this.$route.query.einde : _.last(this.$store.getters.completedYears).yyyy,
        method: this.$route.query.telling ? this.$route.query.telling : "1"
      }
    },
    computed: {
      queryParams() {
        return {
          type: this.type,
          start: this.startYear.toString(),
          einde: this.endYear.toString(),
          strikt: this.strict ? '1' : '0',
          telling: this.method
        };
      },
      query() {
        return this.$route.query;
      },
      selectedSongs() {
        const selectedYears = this.selectedYears;
        if (this.strict) {
          return this.$store.getters.songs.filter(song =>
            selectedYears.every(year => song.position(year))
          );
        } else {
          return this.$store.getters.songs;
        }
      },
      completedYears() {
        return this.$store.getters.completedYears;
      },
      selectedYears() {
        return this.completedYears.filter(year => year.yyyy >= this.startYear && year.yyyy <= this.endYear);
      },
      scoreFn() {
        if (this.method === '1') {
          return position => 101 - position;
        } else {
          return position => 400 / (position + 5);
        }
      },
      rawData() {
        const selectedYears = this.selectedYears;
        const scoreFn = this.scoreFn;
        return this.selectedSongs.map(song => {
          return {
            song: song,
            points: _.sum(
              selectedYears
                .map(year => song.position(year))
                .filter(position => position)
                .map(scoreFn)
            )
          }
        });
      },
      songData() {
        return ranking(
          this.rawData.filter(item => item.points > 0),
          item => -item.points,
          item => item.song.title,
        )
      },
      artistData() {
        const data = _.values(_.groupBy(this.rawData, item => item.song.artistId)).map(items => {
          return {
            artist: _.first(items).song.artist,
            points: _.sum(items.map(item => item.points))
          }
        });

        return ranking(
          data.filter(item => item.points > 0),
          item => -item.points,
          item => item.artist.name,
        )
      },
      albumData() {
        const data = _.values(_.groupBy(this.rawData, item => item.song.albumId)).map(items => {
          return {
            album: _.first(items).song.album,
            artist: _.first(items).song.artist,
            points: _.sum(items.map(item => item.points))
          }
        });

        return ranking(
          data.filter(item => item.points > 0),
          item => -item.points,
          item => item.album.title,
        )
      }
    },
    watch: {
      queryParams(newQueryParams) {
        if (this.active) {
          this.$router.replace({
            query: newQueryParams
          });
        }
      },
      query(newQuery) {
        if (newQuery.type) {
          this.active = true;
          this.type = newQuery.type ? newQuery.type : "nummers";
          this.strict = newQuery.strikt ? newQuery.strikt === "1" : false;
          this.startYear = newQuery.start ? newQuery.start : _.first(this.$store.getters.completedYears).yyyy;
          this.endYear = newQuery.einde ? newQuery.einde : _.last(this.$store.getters.completedYears).yyyy;
          this.method = newQuery.telling ? newQuery.telling : "1";
        } else {
          this.active = false;
        }
      }
    },
    methods: {
      submit() {
        this.active = true;
        this.$router.push({
          query: this.queryParams
        });
      },
    },
    head: {
      title: 'De Tijdloze Tijdloze'
    }
  }
</script>

<style lang="less" scoped>
    div.noot {
        font-size: 85%;
        margin-left: 2em;
    }

    div#toelichting {
        margin-bottom: 2em;
    }

    table.lijst {
        margin-top: 2em;
    }
</style>
