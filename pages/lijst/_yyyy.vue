<template>
    <div class="notabs">
        <h2>De Tijdloze van {{year.yyyy}}</h2>

        <tijdloze-tabs :tabs="tabs">
            <nuxt-child :songs="songs" :year="year" :exits="exits" :newSongs="newSongs" :analyse="analyse" />
        </tijdloze-tabs>

        <table class="lijst" v-if="songs.length">
            <tbody>
                <tr>
                    <th v-if="year.previous()" class="n">
                        <nuxt-link :to="`lijst/${year.previous().yyyy}`">{{year.previous()._yy}}</nuxt-link>
                    </th>
                    <th class="r">{{year._yy}}</th>
                    <th v-if="year.next()" class="n">
                        <nuxt-link :to="`lijst/${year.next().yyyy}`">{{year.next()._yy}}</nuxt-link>
                    </th>
                    <th class="a">
                        <nuxt-link to="/artiesten">Artiest</nuxt-link>
                    </th>
                    <th>
                        <nuxt-link to="/nummers">Titel</nuxt-link>
                    </th>
                    <th>
                        Jaar
                    </th>
                </tr>
                <tr v-for="song in songs" :class="{lineAfter: song.position(year) % 5 === 0}">
                    <td v-if="year.previous()" class="n">
                        <tijdloze-position :song="song" :year="year.previous()" />
                    </td>
                    <td class="r">
                        <tijdloze-position-change :song="song" :year="year" />
                        <tijdloze-position :song="song" :year="year" />
                    </td>
                    <td v-if="year.next()" class="n">
                        <tijdloze-position :song="song" :year="year.next()" />
                    </td>
                    <td class="a">
                        <tijdloze-artist :artist="$store.getters.artistsById[song.artistId]" />
                    </td>
                    <td>
                        <tijdloze-song :song="song" />
                    </td>
                    <td>
                        {{song.releaseYear}}
                    </td>
                </tr>
            </tbody>
        </table>
        <p v-else>Nog geen nummers in de Tijdloze van {{year.yyyy}}.</p>
    </div>
</template>

<script>
    import _ from 'lodash';
    import analyse from '../../store/analyse';

    export default {
    computed: {
      years() {
        return this.$store.getters.years;
      },
      year() {
        return this.years.find(year => year.yyyy.toString() === this.$route.params.yyyy);
      },
      songs() {
        return this.$store.getters.list(this.year);
      },
      newSongs() {
        if (this.year.previous()) {
          return this.songs.filter(song => !song.position(this.year.previous()));
        } else {
          return [];
        }
      },
      exits() {
        if (this.year.previous()) {
          return _.sortBy(
            this.$store.getters.songs.filter(song => {
              return song.position(this.year.previous()) && song.notInList(this.year);
            }),
            song => song.position(this.year.previous())
          );
        } else {
          return [];
        }
      },
      analyse() {
        const item= analyse.find(item => item.yyyy === this.year.yyyy);
        if (item) {
          return item.analyse;
        }
      },
      tabs() {
        let tabs = [];

        if (this.year.previous()) {
          const overviewTitle = this.songs.length >= 100 ? 'Overzicht' : 'Voorlopig overzicht';
          tabs.push({ to: `/lijst/${this.year.yyyy}`, title: overviewTitle});
        }

        if (this.analyse) {
          tabs.push({ to: `/lijst/${this.year.yyyy}/analyse`, title: 'Analyse'});
        }

        if (this.newSongs.length > 0) {
          tabs.push({ to: `/lijst/${this.year.yyyy}/nieuwkomers`, title: 'Nieuwkomers' });
        }

        if (this.exits.length > 0) {
          tabs.push({ to: `/lijst/${this.year.yyyy}/exits`, title: 'Exits' });
        }

        return tabs;
      }
    },
    head() {
      return {
        title: this.year.yyyy
      }
    },
    validate({params, store}) {
      return store.getters.years.find(year => year.yyyy.toString() === params.yyyy);
    },
    fetch ({ params, redirect }) {
      if (params.yyyy === '1987') {
        redirect(301, '/lijst/1987/analyse');
      }
    }
  }
</script>
