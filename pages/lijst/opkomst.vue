<template>
    <div>
        <h2>Welke nummer zijn op komst in de Tijdloze van {{year.yyyy}}?</h2>

        <div class="notabs">

            <div id="toelichting" style="margin-bottom: 1.5em;">
                <p>Welke nummers zijn nog op komst in de Tijdloze van dit jaar? De nummers zijn geordend volgens de posities van vorig jaar.</p>
                <p v-if="exitsUnknown">Opgelet, de exits van dit jaar zijn nog niet bekend!</p>
            </div>

            <table class="lijst perVijf">
                <tbody>
                    <tr>
                        <th class="n">
                            <nuxt-link :to="`lijst/${year.previous().previous().yyyy}`">
                                {{year.previous().previous()._yy}}
                            </nuxt-link>
                        </th>
                        <th class="r">
                            <nuxt-link :to="`lijst/${year.previous().yyyy}`">
                                {{year.previous()._yy}}
                            </nuxt-link>
                        </th>
                        <th class="a"><nuxt-link to="/artiesten">Artiest</nuxt-link></th>
                        <th><nuxt-link to="/nummers">Nummer</nuxt-link></th>
                    </tr>
                    <tr v-for="song in upcomingSongs">
                        <td class="n">
                            <tijdloze-position :song="song" :year="year.previous().previous()" />
                        </td>
                        <td class="r">
                            <tijdloze-position-change :song="song" :year="year.previous()" />
                            <tijdloze-position :song="song" :year="year.previous()" />
                        </td>
                        <td class="a">
                            <tijdloze-artist :artist="song.artist" />
                        </td>
                        <td>
                            <tijdloze-song :song="song"></tijdloze-song>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';

  export default {
    computed: {
      year() {
        return this.$store.getters.currentYear;
      },
      exitsUnknown() {
        return !this.$store.getters.songs.find(song => song.exitCurrent);
      },
      upcomingSongs() {
        return _.sortBy(
          this.$store.getters.songs.filter(song => {
            return !song.exitCurrent && !song.position(this.year) && song.position(this.year.previous());
          }),
          song => -song.position(this.year.previous())
        );
      }
    }
  }
</script>

<style scoped>

</style>
