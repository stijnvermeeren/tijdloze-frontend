<template lang="pug">
  div
    h2 Tijdloze leeftijden
    .toelichting
      p
        tijdloze-links(text='In de onderstaande tabel vindt u de gemiddelde <em>leeftijd</em> (hoeveel jaren eerder het nummer voor het eerst werd uitgebracht) van de Tijdloze nummers, per jaar, en voor bepaalde positie-intervallen.')
      p
        tijdloze-links(text='Het doet misschien wel pijn om klassiekers uit de Tijdloze te zien verdwijnen, maar het is zeker niet zo dat de Tijdloze steeds meer recente nummers beval. In tegendeel! De gemiddelde leeftijd van de nummers in de beginjaren van de Tijdloze was minder dan 15 jaar. Met name sinds 2003 is de gemiddelde leeftijd echter steeds gestegen, en in 2010 waren de nummers in de Tijdloze zelf gemiddeld 22 jaar oud. Bij het bekijken van een oude lijst, krijg je weliswaar de indruk dat die vol met klassiekers staat, maar vergeet niet dat wat nu als een klassieker gezien wordt, toen misschien nog een erg nieuw nummer was!')
      p
        tijdloze-links(text="Als we de gemiddelde leeftijd van de top drie bekijken, valt vooral de machtswissel in [2001] op. Waar enkele jaren eerder de top drie nog bestond uit [Child in Time], [Angie] en [Stairway to Heaven] (uit 1970-'73), bestond in 2001 de top drie plots uit [Smells Like Teen Spirit], [Mia] en [Creep] (uit 1991-'93). Door die generatiewissel sprong de leeftijd aan de top met 20 jaar omlaag. Ondertussen heeft de terugkeer van [Led Zeppelin] in de top drie de gemiddelde leeftijd aan de top weer boven het gemiddelde opgetrokken.")
      p
        tijdloze-links(text='Verder is het opvallend dat de gemiddelde leeftijd van de top 20 van 1994 tot 2001 <em>lager</em> was dan het algemene gemiddelde. Dit was immers de tijd waarin nummers als [Smells Like Teen Spirit], [Alive], [Losing My Religion], [Zombie], [Disarm] en [Creep] al heel snel furore maakten in de Tijdloze. De gemiddelde leeftijd in de onderste helft van de Tijdloze is dan weer iets groter de tegenwoordig, door de vele net-niet-vergeten klassiekers die daar blijven hangen.')
      p
        tijdloze-links(text='Het oudste nummer, absoluut bekeken, dat ooit in de Tijdloze stond, was [Jailhouse Rock] uit 1957. Dit nummer stond echter enkel in [1987] in de Tijdloze, en was toen dus 30 jaar oud. Het oudste nummer van de Tijdloze van [2018], [Feeling Good] van [Nina Simone] uit 1965, was maar liefst 54 jaar oud, een record voor de Tijdloze.')

    tijdloze-tabs(:tabs="[\
      { to: '/statistieken/leeftijden', title: 'Statistieken' },\
      { to: '/statistieken/leeftijden/grafiek', title: 'Op grafiek' }\
    ]")
      nuxt-child
</template>

<script>
  export default {
    head: {
      title: 'Leeftijden'
    },
    ssrComputedCache: true
  }
</script>
