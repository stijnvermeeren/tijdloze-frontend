<template lang="pug">
Title Eenjaarsvliegen
div
  h2 Tijdloze Eenjaarsvliegen
  .toelichting
    p
      make-links(text='Eenjaarsvliegen zijn nummers die in een editie van de Tijdloze (op)nieuw binnenkwamen, om het volgende jaar meteen weer uit de Tijdloze te verdwijnen. Nummers die bovendien buiten dat ene jaar nooit in de Tijdloze stonden, noemen we <strong>definitieve</strong> eenjaarsvliegen.')
    p
      make-links(text='Vroeger waren er veel eenjaarsvliegen, maar tegenwoordig is het een zelfzaam fenomeen geworden, de Tijdloze is blijkbaar minder grillig geworden.')
    p
      make-links(text="Er zijn een aantal nummers die rare bokkensprongen gemaakt hebben, [Everything I Do] van [Bryan Adams] bijvoorbeeld: in [1991] nieuw binnen op 34, in ['92] plots verdwenen om een jaar later terug binnen te stormen op 58. Of nog: in [1995] kwamen zowel [I Alone] en [Self Esteem] nieuw binnen in de top 50, maar de volgende jaren was er van [Live] en [The Offspring] geen spoor meer in de Tijdloze. Pas vanaf [1998] vonden beide bands hun tweede adem. Toen hielden [Live] en [The Offspring] het acht jaar vol, maar inmiddels zijn ze weer uit de Tijdloze verdwenen.")
    p
      make-links(text="Er zijn ook een aantal nummers die in één jaar heel hoog stonden, en voor de rest nooit in een lijst voorkomen. [Glenn Medeiros] bijvoorbeeld: in [1988] nieuw binnen op 40 met [Nothing's Gonna Change My Love For You] en dan niets meer. Hetzelfde overkwam [Runaway Train] van [Soul Asylum]: het nummer stond enkel in [1993] op de lijst, maar dan wel op plaats 48!")
    p
      make-links(text='De eenjaarsvliegkampioen is echter [Michael Jackson]: in [1988] kwamen maar liefst drie van zijn nummers nieuw binnen: [Bad], [Thriller] en [Dirty Diana]. Twintig jaar lang zouden dit zijn enige noteringen in de Tijdloze zijn. Pas in 2009, na [Michael Jackson]s overlijden, zou Thriller opnieuw de Tijdloze binnenkomen.')

  ui-tabs(:tabs="[\
    { to: '/statistieken/eenjaarsvliegen', title: 'Per jaar' },\
    { to: '/statistieken/eenjaarsvliegen/lijst', title: 'Hoogste aller tijden' },\
    { to: '/statistieken/eenjaarsvliegen/grafiek', title: 'Op grafiek' }\
  ]")
    nuxt-page(:data='data' :years='years')
</template>

<script>
  import List from "../../orm/List";
  import {useRootStore} from "~/stores/root";
  import {useRepo} from "pinia-orm";

  export default {
    computed: {
      years() {
        return useRootStore().years;
      },
      songs() {
        return useRootStore().songs;
      },
      data() {
        const dataPoints = [];
        useRepo(List).with('top100Songs', query => query.with('artist')).get().forEach(list => {
          const year = useRootStore().year(list.year)
          if (year.previous() && year.next()) {
            list.top100Songs.forEach(song => {
              if (song.notInList(year.previous()) && song.notInList(year.next())) {
                dataPoints.push({
                  song: song,
                  year: year,
                  isFinal: (this.years.filter(year => song.position(year)).length === 1)
                });
              }
            })
          }
        });
        return dataPoints;
      }
    }
  }
</script>
