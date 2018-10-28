<template>
    <div>
        <h2>Tijdloze landen</h2>

        <div class="toelichting">
            <p><tijdloze-links text="Van welke nationaliteit zijn de artiesten wiens nummers in de Tijdloze staan? Meteen valt op dat het [*Verenigd Koninkrijk] en de [*USA] voor maar liefst 77% van alle nummers zorgen. De verdeling tussen de twee landen is echter doorheen de jaren wel omgedraaid. Tot ['99] had het Verenigd Koninkrijk consequent de meeste noteringen, maar sinds [2000] vinden we de nummers uit de Verenigde Staten Tijdlozer." /></p>
            <p><tijdloze-links text="Eens kijken naar [*België] dan. Als je naar de cijfers kijkt, dan wordt duidelijk dat [dEUS] enorm veel betekend heeft voor de rockmuziek in België. Bij de eerste editie in [1987] werd België enkel vertegenwoordigd door [O La La La] van [T.C. Matic]. In [1994] bleef het aantal nummers van eigen bodem nog steeds steken op 4. En toen was er [dEUS]. Niet alleen kwamen de songs van de gODen massaal in de Tijdloze (6 nummers in ['99], ['02] en ['03]), maar opeens kregen de Tijdloze stemmers ook aandacht voor eigen bands als [K's Choice], [Zita Swoon], [Novastar], [De Mens] en [Hooverphonic]. En er is ook nog [Mia] natuurlijk..." /></p>
            <p><tijdloze-links text="Andere landen met een aantal bands in de Tijdloze zijn [Ierland] ([U2], [Sinéad O'Connor], [Cranberries], [Therapy?]), [Canada] ([Bryan Adams], [Arcade Fire], [Alanis Morissette], [Steppenwolf], [Neil Young]), [Australië] ([AC/DC], [Nick Cave], [Crowded House]) en [Nederland] ([Golden Earring], [Krezip], [The Scene]). De kruimeltjes worden opgeraapt door [Jamaica] ([Bob Marley]), [Duitsland] ([Guano Apes], [Scorpions]), [Frankrijk] ([Serge Gainsbourg & Jane Birkin] en [Laurent Garnier]) en [Zweden] ([Abba])." /></p>
        </div>

        <div class="scrollbox">
            <table class="lijst">
                <tbody>
                    <tr>
                        <th>Land</th>
                        <th></th>
                        <th v-for="year in tableFilter(years)">{{year.yyyy}}</th>
                        <th>Alle jaren</th>
                    </tr>
                    <template v-for="{country, total, perYear, graphData} in data">
                        <tr>
                            <td>
                                <tijdloze-country-icon :country="country" :includeName="true" />
                            </td>
                            <td>
                                <button v-if="!showDetails[country.id]" @click="toggleDetails(country.id)">Meer details</button>
                                <button v-else @click="toggleDetails(country.id)">Verberg details</button>
                            </td>
                            <td v-for="{count} in tableFilter(perYear)">
                                {{count}}
                            </td>
                            <td>
                                {{total}}
                            </td>
                        </tr>
                        <transition name="fade" :duration="500">
                            <tr v-if="showDetails[country.id]" class="details">
                                <td colspan="5">
                                   <div class="wrapper">
                                        <tijdloze-distribution-graph :points="graphData" />
                                    </div>
                                </td>
                            </tr>
                        </transition>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
  import DistributionGraph from "../../components/d3/DistributionGraph"
  import Vue from 'vue';
  import _ from 'lodash';

  export default {
    components: {
      TijdlozeDistributionGraph: DistributionGraph
    },
    data() {
      return {
        showDetails: {}
      };
    },
    computed: {
      years() {
        return this.$store.getters.years;
      },
      countries() {
        return _.sortBy(
          this.$store.state.countries,
          country => country.name
        );
      },
      data() {
        const dataPoints = {};
        const graphDataPerCountry = this.countries.map(country => {
          dataPoints[country.id] = [];
          return {
            country: country,
            graphData: dataPoints[country.id]
          };
        });

        this.$store.getters.songs.forEach(song => {
          this.years.forEach(year => {
            if (song.position(year)) {
              dataPoints[song.artist.countryId].push({
                song: song,
                year: year
              });
            }
          });
        });

        return graphDataPerCountry.map(({country, graphData}) => {
          return {
            country: country,
            graphData: graphData,
            total: graphData.length,
            perYear: this.years.map(year => {
              return {
                year: year,
                count: graphData.filter(dataPoint => dataPoint.year.equals(year)).length
              }
            })
          }
        });
      }
    },
    methods: {
      decadeYear(yyyy) {
        return yyyy - yyyy % 10;
      },
      tableFilter(data) {
        return _.takeRight(data, 2);
      },
      toggleDetails(countryId) {
        Vue.set(this.showDetails, countryId, !this.showDetails[countryId]);
      }
    },
    head: {
      title: 'Landen'
    }
  }
</script>

<style lang="less" scoped>
    @import "../../assets/styleConfig";

    tr.details {
        background-color: @inputBackgroundColor;

        div.wrapper {
            overflow: hidden;
            max-height: 2000px;
        }

        &.fade-enter-active {
            div.wrapper {
                transition: all .5s ease;
            }
        }

        &.fade-leave-active {
            div.wrapper {
                transition: all .5s cubic-bezier(0, 1.05, 0, 1);
            }
        }

        &.fade-enter, &.fade-leave-to {
            div.wrapper {
                max-height: 0;
            }
        }
    }

</style>

