<template lang="pug">
  div
    h2 Geschiedenis van de Tijdloze Website
    p In 1987 zag niet alleen de eerste Tijdloze het levenslicht, maar ook de maker van deze website, Stijn Vermeeren.
    p Stijn is een liefhebber van zowel goede muziek als interessante statistieken. Die combinatie leidde eerder al tot een #[a(href='http://www.stijnvermeeren.be/download/afrekening.mp3') kleine interventie in De Afrekening], toen Peter Van de Veire die nog presenteerde.
    p Interessante statistieken van goede muziek zijn zeker te vinden in De Tijdloze. In de lente van 2001 begon Stijn met het verzamelen van alle Tijdloze lijsten, om er nieuwe muziek in te ontdekken, en ook uit nieuwsgierigheid naar de trends in de #[em tijdloze] muziek door de jaren heen. En waarom daar niet meteen een kleine website rond bouwen? De Tijdloze Website was meteen een succes, en het regende tips, suggesties en complimentjes van de bezoekers.
    p In 2004 verdween de website gedurende enkele maanden van het internet door problemen met de hosting provider. Tegen december was de site echter in vernieuwde vorm terug, en tijdens de Tijdloze van 2004 werd de site voor het eerst live aangepast. Dat lokte meer dan 1000 unieke bezoekers op die dag.
    p Het jaar 2005 bracht kortweg een betere website en dubbel zoveel bezoekers. De website van Studio Brussel bezweek tijdens de uitzending van de Tijdloze traditiegetrouw onder de vele bezoekers, die naar deze Tijdloze Website uitweken om de Tijdloze online te volgen. Een leuk nieuwigheidje op de Tijdloze Website gedurende de Tijdloze van 2005 was de chatbox.
    p Bij Studio Brussel was men inmiddels danig onder de indruk van deze website, dat men in 2006 #[a(href='http://www.stijnvermeeren.be/download/tijdloze.mp3') Stijn zelfs opbelde en uitgebreid zijn zegje liet doen in volle uitzending]. (In feite was het gesprek de dag ervoor al opgenomen, en is Stijn de makers erg dankbaar om de allerdomste uitspraken en langste euh-momenter er toch uit te knippen.) Het resultaat was de omgekeerde wereld: de Tijdloze Website lag plots plat door de enorme belangstelling, terwijl de website van Studio Brussel het zowaar een hele Tijdloze lang vol hield. Ondanks die problemen vonden meer dan 5000 unieke bezoekers hun weg naar de website op de dag van de Tijdloze.
    p In de daarop volgende jaren bleef de Tijdloze website een vaste waarde, meer elk jaar tussen de 5000 en 10000 unieke bezoekers op de dag van de uitzending. In 2013 kon Stijn wegens andere verplichtingen de website zelf niet aanpassen tijdens de Tijdloze. Twee trouwe bezoekers - Wibren #[em "Munz"] Moens en Wouter #[em "Link"] Verbeke - zetten meteen een #[a(href='http://tijdloze.weebly.com/') plaatsvervangende website] op, met live updates en een chatbox. Sinds 2014 is Stijn er weer zelf bij, en ook Wouter blijft sindsdien meehelpen bij het onderhouden van de echte Tijdloze Website.
    p Op 24 november 2014, tijdens de stemweek voor de Tijdloze, werd #[a(href='http://www.stijnvermeeren.be/download/tijdloze20141124.mp3') webmaster Stijn live opgebeld door Studio Brussel].
    p In 2018 werd de technologie van de website volledig vernieuwd. Een moderne &quot;single page application&quot; op basis van Vue.js kwam in de plaats van de oude PHP-technologie. Sinds 2020 is de website officeel volledig #[nuxt-link(to="/website/opensource") open source].

    el-card
      div.header(slot="header")
        div.title De toekomst
      p Elk jaar steekt webmaster Stijn enkele dagen werk in De Tijdloze Website. Zo is er elk jaar tijd voor enkele kleine vernieuwingen. Dit is alvast een voorsmaakje van wat er de volgende jaren gepland is:
      ul
        li Geleidelijke overgang naar een modernere &quot;responsive&quot; layout voor de website.
        li Meer interactieve elementen in de grafieken.
        li Betere integratie van de chatbox in de website.
        li Involveren van meerdere medewerkers, vooral tijdens de uitzending, zodat de website niet langer afhankelijk is van een enkele webmaster.
</template>

<script>
  export default {
    head: {
      title: "Geschiedenis"
    }
  }
</script>
