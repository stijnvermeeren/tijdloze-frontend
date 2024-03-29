<template lang="pug">
Title Methodologie
div
  h2 Methodologie

  ui-card(title="Schrijfwijze")
    p
      | We volgen zo veel mogelijk de regels en de conventies die passen bij het land van herkomst van de artiest en/of bij de taal van het nummer.
    p
      | Gebruik van hoofdletters in titels:
    ul
      li
        make-links(text='In het Engels worden de meeste woorden in een titel met een hoofdletter geschreven, behalve woorden zoals lidwoorden en voorzetsels. Meer informatie op websites als <a href="https://capitalizemytitle.com/">capitalizemytitle.com</a>. Voorbeelden: [Stairway to Heaven], [Thinking of a Place], [Smoke on the Water], [In the Air Tonight]. Let wel op bij titels zoals [Shine On You Crazy Diamond]. Hier is "on" met een hoofdletter geschreven, omdat het in deze titel geen voorzetsel is, maar wel deel van het werkwoord "to shine on".')
      li
        make-links(text="In het Duits worden alle zelfstandige naamwoorden met een hoofdletter geschreven, bijvoorbeeld: [Mein Herz brennt], [Haus am See].")
      li
        make-links(text="In het Nederlands (en in de meeste andere talen) wordt normaal gezien enkel de eerste letter van het eerste woord met een hoofdletter geschreven. Andere woorden worden klein geschreven, tenzij ze sowieso met een hoofdletter beginnen. Bijvoorbeeld: [Lieve kleine piranha], [T-shirt van Metallica], [Je t'aime... moi non plus].")


  ui-card(title="Album en jaartal")
    p Elk nummer is in de databank verbonden met het album waarop het nummer oorspronkelijk is verschenen. Het jaartal dat bij een nummer wordt getoond, en dat wordt gebruikt om de #[em leeftijd] van nummers in de Tijdloze te berekenen, is steeds het jaar waarop dit album voor het eerst is uitgebracht. Er zijn vrij veel nummers die niet in hetzelfde kalenderjaar op single zijn verschenen, maar bijvoorbeeld al een jaar eerder of pas een jaar later. Hier wordt in de databank van deze website geen rekening mee gehouden. Enkel bij liedjes die als alleenstaand nummer werden uitgebracht (of die pas verschillende jaren later toch nog deel zijn geworden van een album) wordt de single zelf (met het bijhorende release-jaar) als album voor het nummer opgeslagen. Greatest hits-albums of soundtracks van films worden enkel in de database opgenomen als er ook nummers op staan die nooit eerder op een ander album verschenen zijn.
    p
      make-links(text="Het gebeurt ook dat b-kantjes van singles in de Tijdloze terechtkomen, bijvoorbeeld [The Masterplan] van [Oasis], een b-kantje van [Wonderwall]. In dit geval is The Masterplan in de database met de single Wonderwall verbonden, terwijl het nummer Wonderwall zelf echter met het album <em>(What's The Story) Morning Glory?</em> verbonden is.")
    p
      make-links(text="Van sommige albums bestaan er verschillende uitgaves die niet steeds dezelfde nummers bevatten. Het nummer [Fools Gold] van [The Stone Roses] staat bijvoorbeeld niet op de oorspronkelijke Britse uitgave van het debuutalbum van de band, maar wel op sommige internationale uitgaves. Op deze website kiezen we er normaal gezien voor om zulke nummers toch als deel van het album te beschouwen, en niet als alleenstaande single, ook al staat het nummer niet op elke versie van het album.")


  ui-card(title="Landen")
    p
      make-links(text="In de databank van tijdloze.rocks is het land van herkomst van elke artiest vastgelegd. Hierbij wordt steeds het best passende vandaag bestaande land gekozen. Bands zoals [Scorpions] and [Kraftwerk], die in het voormalige West-Duitsland zijn groot geworden, worden dus gewoon als Duits geteld.")
    p
      make-links(text="De nationaliteit van de artiest en/of van de bandleden geeft niet altijd een eenduidig antwoord. Enerzijds hebben sommige mensen meerdere nationaliteiten. Anderzijds kan een band uit leden met verschillende nationaliteit zijn samengesteld. In geval van twijfel houden we daarom ook rekening met het land waar be band is opgericht, of met het land waar de artiest de eerste doorbraak heeft gemaakt. Bijvoorbeeld:")
      ul
        li
          make-links(text="[Fleetwood Mac] wordt op deze website als Britse artiest geklasseerd, omdat de groep in Londen werd opgericht en oorspronkelijk alleen maar uit Britse muzikanten bestond, ook al kwamen er later twee heel bekende Amerikaanse leden bij (Lindsey Buckingham en Stevie Nicks).")
        li
          make-links(text="[Gabriel Ríos] wordt op deze website als Belgische artiest geteld, niet als Amerikaans of Puerto Ricaans, omdat hij in België is doorgebroken.")
        li
          make-links(text="[Joe Dassin] had een dubbele Frans-Amerikaanse nationaliteit en is vooral in de Verenigde Staten opgegroeid, maar omdat hij in Frankrijk een grotere bekendheid geniet, wordt hij op deze website als Frans geteld.")
        li
          make-links(text="[Manu Chao] heeft een dubbele Frans-Spaanse nationaliteit. Hier is Frankrijk als zijn land van herkomst vastgelegd, omdat hij daar geboren en opgegroeid is.")
        li
          make-links(text="[Grinderman] had Australische en Amerikaanse bandleden, terwijl de groep zelf in Londen werd gevormd. Hier wordt de band als Australisch geteld, omdat de meeste bandleden (waaronder frontman [Nick Cave]) de Australische nationaliteit hebben.")
        li
          make-links(text="[Buffalo Springfield] was een band met Amerikaanse en Canadese leden. Omdat de band in de Verenigde Staten is opgericht, is hier voor dat land van herkomst gekozen. Een gelijkaardig argument is onder andere van toepassing op [Foreigner], [Traveling Wilburys], [Steppenwolf] en [The Pogues].")
        li
          make-links(text="De [Bee Gees] worden hier als Britse band geteld, want de bandleden, de drie broers Gibbs, zijn in het Verenigd Koninkrijk geboren en hebben de Britse nationaliteit. De band is echter doorgebroken in Australië terwijl de familie Gibbs daar woonde, en wordt daarom ook soms als Australische band beschouwd. Een gelijkaardige situatie vinden we bij [America].")

  ui-card(title="Talen")
    p
      make-links(text="In de databank van tijdloze.rocks is de taal van elk nummer vastgelegd. We hebben ervoor gekozen om hier geen fijne indeling te maken in dialecten en streektalen. De West-Vlaamse teksten van [Het Zesde Metaal] of ['t Hof van Commerce], en het Antwerps van [The Clement Peerens Explosition] worden dus bijvoorbeeld als Nederlands geteld. Nummers die geen duidelijke tekst hebben, worden als instrumentaal geteld.")
    p
      | Meestal is de taal van een nummer duidelijk gedefinieerd, maar toch zijn er een aantal interessante randgevallen waar de taal toch niet zo eenduidig is, bijvoorbeeld:
    ul
      li
        make-links(text="[Je veux de l'amour] van [Raymond van het Groenewoud] heeft een Franstalige titel, maar bijna de hele tekst is in het Nederlands, dus het nummer wordt hier als Nederlandstalig geteld. Een gelijkaardig argument kan ook bijvoorbeeld voor [Sexy Boy] van [Air] (Franstalig, niet Engelstalig) en voor [Que Pasa] van [T.C. Matic] (Engelstalig, niet Spaans) gemaakt worden.")
      li
        make-links(text="[Putain Putain] van [T.C. Matic] wordt als Franstalig geteld, hoewel er ook stukken Engelse en Vlaamse tekst in het nummer zitten. Gelijkaardige gevallen vinden onder andere we bij [The Partisan] van [Leonard Cohen] (drie originele Franstalige strofes in een hoofdzakelijk naar het Engels vertaald nummer), [Denis] van [Blondie] (strofe in het Frans in een hoofdzakelijk Engelstalig nummer), [The Robots] van [Kraftwerk] (fragmenten in het Russisch in een hoofdzakelijk Engelstalig nummer), [Jeanny] van [Falco] (Engelstalig refrein in een hoofdzakelijk Duitstalig nummer) en [Spanish Stroll] van [Mink DeVille] (strofe in het Spaans in een hoofdzakelijk Engelstalig nummer).")
      li
        make-links(text="[For Evigt] van [Volbeat] heeft een Deense titel en refrein, maar de strofes zijn in het Engels. Op deze website wordt het nummer als Engels geteld, maar dit is echt wel een arbitraire keuze.")

  ui-card(title="Lead vocals")
    p De Tijdloze werd altijd al gedomineerd door mannen. Misschien wel daarom is er ook altijd al speciale aandacht geweest voor het kleinere aantal vrouwen in de Tijdloze. In 2018 was er zelfs een grootschalige campagne om meer vrouwen in de top 100 te krijgen.
    p
      make-links(text="Maar hoe tel je nu het aantal vrouwen en mannen in de Tijdloze? De band [Massive Attack] bijvoorbeeld bestaat alleen maar uit mannen, maar hun bekendste nummer [Unfinished Sympathy] heeft wel een tekst die door een vrouw is gezongen. Daarom leek het ons logischer om niet naar de geslachten van alle bandleden te kijken, maar wel naar de <em>lead vocals</em> van elk nummer. We hebben hierbij vier categoriën gedefinieerd: <em>man</em>, <em>vrouw</em>, <em>duet</em> (voor nummers waarbij mannelijke en vrouwelijke stemmen een min of meer evenwaardige rol spelen) en <em>instrumentaal</em>. Dit is natuurlijk een abstractie, en niet elk nummer past even goed in deze categorieën. Een voorbeeld waar dit waarschijnlijk tamelijk gevoelig ligt, is [K's Choice]. Het lijkt ons het meest logisch om nummers zoals [Not an Addict] nog bij de vrouwelijke lead vocals te tellen, ook al gaat zanger Sam Bettens (vroeger gekend als Sarah Bettens) tegenwoordig door het leven als man. Een gelijkaardig geval vinden we ook bij [Christine and the Queens].")
    p
      make-links(text="De lead vocals zijn dus een eigenschap van elk nummer, en die is niet altijd hetzelfde voor de nummers van eenzelfde artist. Zo heeft [Fleetwoord Mac] bijvoorbeeld nummers in alle vier categorieën: <em>man</em> (bijvoorbeeld [Go Your Own Way]), <em>vrouw</em> (bijvoorbeeld [Dreams]), <em>duet</em> (bijvoorbeeld [The Chain]) en instrumentaal ([Albatross]).")
    p
      make-links(text="Er zijn twee opvallende nummers in de databank waarbij de taal als <em>instrumentaal</em> is gedefinieerd, maar de lead vocals niet. [Hocus Pocus] van [Focus] heeft geen tekst, maar er wordt toch gezongen door een mannelijke stem. En [The Great Gig in the Sky] van [Pink Floyd] heeft weliswaar een korte Engelstalige tekst die door een man wordt gesproken, maar het nummer wordt gedomineerd door woordenloos vrouwelijk gezang.")
</template>
