<template lang="pug">
  div
    h2 Methodologie

    h3 Schrijfwijze
    p
      | We volgen zo veel mogelijk de regels en de conventies die passen bij het land van herkomst van de artiest en/of bij de taal van het nummer.
    p
      | Gebruik van hoofdletters in titels:
    ul
      li
        tijdloze-links(text='In het Engels worden de meeste woorden in een titel met een hoofdletter geschreven, behalve woorden zoals lidwoorden en voorzetsels. Meer informatie op websites als <a href="https://capitalizemytitle.com/">capitalizemytitle.com</a>. Voorbeelden: [Stairway to Heaven], [Thinking of a Place], [Smoke on the Water], [In the Air Tonight]. Let wel op bij titels zoals [Shine On You Crazy Diamond]. Hier is "on" met een hoofdletter geschreven, omdat het in deze titel geen voorzetsel is, maar wel deel van het werkwoord "to shine on".')
      li
        tijdloze-links(text="In het Duits worden alle zelfstandige naamwoorden met een hoofdletter geschreven, bijvoorbeeld: [Mein Herz brennt], [Haus am See].")
      li
        tijdloze-links(text="In het Nederlands (en in de meeste andere talen) wordt normaal gezien enkel de eerste letter van het eerste woord met een hoofdletter geschreven. Andere woorden worden klein geschreven, tenzij ze sowieso met een hoofdletter beginnen. Bijvoorbeeld: [Lieve kleine piranha], [T-shirt van Metallica], [Je t'aime... moi non plus].")


    h3 Landen
    p
      tijdloze-links(text="In de databank van de Tijdloze Website is het land van herkomst van elke artiest vastgelegd. Hierbij wordt steeds het best passende vandaag bestaande land gekozen. Bands zoals [Scorpions] and [Kraftwerk], die in het voormalige West-Duitsland zijn groot geworden, worden dus gewoon als Duits geteld.")
      tijdloze-links(text="De nationaliteit van de artiest en/of van de bandleden geeft niet altijd een eenduidig antwoord. Enerzijds hebben sommige mensen meerdere nationaliteiten. Anderzijds kan een band uit leden met verschillende nationaliteit zijn samengesteld. In geval van twijfel houden we daarom ook rekening met het land waar be band is opgericht, of met het land waar de artiest de eerste doorbraak heeft gemaakt. Bijvoorbeeld:")
      ul
        li
          tijdloze-links(text="[Gabriel Ríos] wordt op deze website als Belgische artiest geteld, niet als Amerikaans of Puerto Ricaans, omdat hij in België is doorgebroken.")
        li
          tijdloze-links(text="[Joe Dassin] had een dubbele Frans-Amerikaanse nationaliteit en is vooral in de Verenigde Staten opgegroeid, maar omdat hij in Frankrijk een grotere bekendheid geniet, wordt hij op deze website als Frans geteld.")
        li
          tijdloze-links(text="[Manu Chao] heeft een dubbele Frans-Spaanse nationaliteit. Hier is Frankrijk als zijn land van herkomst vastgelegd, omdat hij daar geboren en opgegroeid is.")
        li
          tijdloze-links(text="[Grinderman] had Australische en Amerikaanse bandleden, terwijl de groep zelf in Londen werd gevormd. Hier wordt de band als Australisch geteld, omdat de meeste bandleden (waaronder frontman [Nick Cave]) de Australische nationaliteit hebben.")
        li
          tijdloze-links(text="[Buffalo Springfield] was een band met Amerikaanse en Canadese leden. Omdat de band in de Verenigde Staten is opgericht, is hier voor dat land van herkomst gekozen. Een gelijkaardig argument is van toepassing op [Foreigner] (Verenigde Staten, niet Verenigd Koninkrijk)")

    h3 Talen
    p
      tijdloze-links(text="In de databank van de Tijdloze Website is de taal van elk nummer vastgelegd. We hebben ervoor gekozen om hier geen fijne indeling te maken in dialecten en streektalen. De West-Vlaamse teksten van [Het Zesde Metaal] of ['t Hof van Commerce], en het Antwerps van [The Clement Peerens Explosition] worden dus bijvoorbeeld als Nederlands geteld. Nummers die geen duidelijke tekst hebben, worden als instrumentaal geteld.")
    p
      | Meestal is de taal van een nummer duidelijk gedefinieerd, maar toch zijn er een aantal interessante randgevallen waar de taal toch niet zo eenduidig is, bijvoorbeeld:
    ul
      li
        tijdloze-links(text="[Je veux de l'amour] van [Raymond van het Groenewoud] heeft een Franstalige titel, maar bijna de hele tekst is in het Nederlands, dus het nummer wordt hier als Nederlandstalig geteld. Een gelijkaardig argument kan ook voor [Sexy Boy] van [Air] gemaakt worden (Franstalig, niet Engelstalig) en voor [Jeanny] van [Falco] (Duitstalig, niet Engelstalig) gemaakt worden.")
      li
        tijdloze-links(text="[Putain Putain] van [T.C. Matic] wordt als Franstalig geteld, hoewel er ook stukken Engelse en Vlaamse tekst in het nummer zitten. Gelijkaardige gevallen vinden onder andere we bij [Denis] van [Blondie] (strofe in het Frans in een hoofdzakelijk Engelstalig nummer), [The Robots] van [Kraftwerk] (fragmenten in het Russisch in een hoofdzakelijk Engelstalig nummer) en [Spanish Stroll] van [Mink DeVille] (strofe in het Spaans in een hoofdzakelijk Engelstalig nummer).")
      li
        tijdloze-links(text="[For Evigt] van [Volbeat] heeft een Deense titel en refrein, maar de strofes zijn in het Engels. Op deze website wordt het nummer als Engels geteld, maar dit is echt wel een arbitraire keuze.")


    h3 Lead vocals
</template>

<script>
    import PageTitle from "@/components/PageTitle";
    export default {
      components: {PageTitle},
      head: {
        title: "Methodologie"
      }
    }
</script>
