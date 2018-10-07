<template>
    <div>
        <h2>De Tijdloze Tijdloze</h2>


        <div class="notabs">

            <div id="toelichting">
                <p><tijdloze-links text="Wat als je alle edities van de Tijdloze bij elkaar gooit? Wie komt er dan uit als het ultieme tijdloze Tijdloze nummer? Veel mensen willen het weten, maar het antwoord is niet zo eenvoudig. Want op welke manier geef je punten aan de nummers? Bekijk je enkel nummers die in elke Tijdloze genoteerd waren? Is het eerlijk om een nummer uit 1967 te vergelijken met een nummer uit 2001?" /></p>
                <p><tijdloze-links text="Op deze pagina kan je zelf met verschillende instellingen experimenteren, de Tijdloze Tijdloze wordt automatisch gegenereerd. Naargelang de instellingen zal je verschillende nummers aan kop vinden, dus we zullen hier ook geen ultieme winnaar uitroepen. Maar toch enkele algemene observaties: [Child In Time] staat in de meeste lijstjes bovenaan, samen met klassiekers als [Angie], [Stairway To Heaven] en [Bohemian Rhapsody]. De recentere jaren worden echter aangevoerd door [Smells Like Teen Spirit], [Mia], [One;Metallica] en [Creep]. Slechts 15 nummers stonden in elke Tijdloze, terwijl [Smells Like Teen Spirit] meestal het hoogste recentere nummer is." /></p>
                <p><tijdloze-links text="Je kan hier ook de punten per artiest laten samentellen, en zo een ranglijst van de beste Tijdloze Artiesten krijgen. Hier vind je weer de grote kleppers aan de top als [Deep Purple], [The Rolling Stones] en [Led Zeppelin]. Maar ook groepen als [The Doors], [U2], [dEUS] en [Radiohead], die geen heel hoge maar wel veel noteringen hebben, scoren hier goed. Om [Gorky], die enkel scoorde met [Mia], te vinden moet je echter naar beneden scrollen." /></p>
            </div>

            <p>&nbsp;</p>

            <table>
                <tbody>
                    <tr>
                        <td class="bold">Vergelijk:</td>
                        <td>
                            <select v-model="type">
                                <option value="nummers">Nummers</option>
                                <option value="artiesten">Artiesten</option>
                                <option value="albums">Albums</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td class="bold">Van:</td>
                        <td>
                            <select v-model="startYear">
                                <option v-for="year in completedYears" value="year.yyyy">{{year.yyyy}}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td class="bold">Tot:</td>
                        <td>
                            <select v-model="endYear">
                                <option v-for="year in completedYears" value="year.yyyy">{{year.yyyy}}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <input type="checkbox" v-model="strict" class="ch" />
                            Tel enkel nummers die in elke Tijdloze stonden
                        </td>
                    </tr>
                    <tr>
                        <td class="bold top">Methode:</td>
                        <td>
                            <div><input v-model="method" type="radio" class="ra" value="1" /> Eenvoudige telling</div>
                            <div class="noot">Het nummer op de eerste plaats krijgt 100 punten, de tweede 99, de derde 98, en zo verder tot de honderste die nog 1 punt krijgt... <em>Formule: punten = 101 - positie</em>.</div>
                            <div><input v-model="method" type="radio" class="ra" value="2" /> Realistische telling</div>
                            <div class="noot">Deze telling leunt dichter aan bij het aantal stemmen dat elk nummer waarschijnlijk door de jaren heen gekregen heeft. De formule hiervoor is gebaseerd op de Tijdloze van 1998. Toen was de schiftingsvraag 'hoeveel stemmen hebben alle nummers in de top 100 gekregen'. Tijdens de uitzending werden er af en toe <em>updates</em> gegeven over hoeveel stemmen sommige nummers kregen, en wat het subtotaal van de stemmen was. Een formule die grofweg het aantal stemmen per positie benadert, is <em>400 / (positie + 5)</em>. Deze formule wordt hier gebruikt.</div>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <button @click="submit" type="submit">Bereken Tijdloze Tijdloze</button>
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
    data() {
      return {
        type: "nummers",
        strict: false,
        startYear: this.defaultStartYear,
        endYear: this.defaultEndYear,
        method: "1"
      }
    },
    computed: {
      songs() {
        return this.$store.getters.songs;
      },
      defaultStartYear() {
        return _.first(this.completedYears).yyyy.toString();
      },
      defaultEndYear() {
        return _.last(this.completedYears).yyyy.toString();
      },
      completedYears() {
        return this.$store.getters.years.filter(year => {
          return this.songs.find(song => song.position(year) === 1);
        });
      }
    },
    methods: {
      submit() {
        this.$router.push(
          {
            query: {
              type: this.type,
              start: this.startYear,
              einde: this.endYear,
              strikt: this.strict ? 1 : 0,
              telling: this.method
            }
          }
        );
      }
    },
    head: {
      title: 'De Tijdloze Tijdloze'
    }
  }
</script>
