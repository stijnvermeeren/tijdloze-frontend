<template lang="pug">
Title Website
div
  h2 Over tijdloze.rocks

  p Tijdloze.rocks verzamelt alle lijsten en bijhorende statistieken van De Tijdloze. De Tijdloze is sinds 1987 de allertijdenlijst van de Vlaamse radiozender #[a(href='http://stubru.be' title='Website Studio Brussel') Studio Brussel]. De Tijdloze wordt bepaald door stemmen van de luisteraars van Studio Brussel en wordt op het einde van elk jaar uitgezonden.
  p Tijdloze.rocks is volledig #[strong onafhankelijk van Studio Brussel] en de #[a(href='http://vrt.be') VRT]. Tijdloze.rocks heeft niets te maken met de samenstelling of het uitzenden van de Tijdloze. Tijdloze.rocks dankt wel Studio Brussel voor de hulp met het vervolledigen van de database van deze website.

  ui-card(title="Team")
    template(#buttons)
      nuxt-link(to="/website/contact")
        v-btn(rounded variant="tonal" size="small") Contact
    p Tijdloze.rocks wordt beheerd door #[strong Stijn Vermeeren]. U kunt hem een berichtje sturen via het #[nuxt-link(to='/website/contact') contactformulier]. Suggesties of verbeteringen voor de website worden ten zeerste geapprecieerd. U kan ook eens een kijkje nemen op de #[a(href='http://www.stijnvermeeren.be' title='Persoonlijke website Stijn Vermeeren') persoonlijke website] van webmaster Stijn.
    p Sinds 2014 krijgt Stijn hulp van #[strong Wouter #[em "Link"] Verbeke] bij het onderhouden en updaten van de website tijdens de uitzending van de Tijdloze, en sinds 2021 ook van #[strong Dries Wellekens].
    p Speciale dank aan...
    ul
      li #[a(href='http://stubru.be' title='Website Studio Brussel') Studio Brussel] - voor het uitzenden van de Tijdloze, zonder wie er geen Tijdloze Website zou zijn, en voor de hulp bij het vervolledigen van de statistieken.
      li De vlag-icoontjes komen van #[a(href='https://flagpedia.net') Flagpedia].
      li Iedereen die mij tips gemaild heeft of mij op foutjes gewezen heeft - voor het verbeteren van de kwaliteit van deze website.


  ui-card(title="Technologie")
    template(#buttons)
      nuxt-link(to="/website/opensource")
        v-btn(rounded variant="tonal" size="small") Open source
    p Tijdloze.rocks is volledig #[nuxt-link(to='/website/opensource') open source]. Iedereen mag de broncode bekijken en hergebruiken.
    p Hulp bij het verbeteren van de layout en de functionaliteiten is steeds welkom. Wie geïnteresseerd is om mee te helpen, mag me steeds #[nuxt-link(to='/website/contact') contacteren] of meteen op GitHub aan de slag gaan.
    p De website wordt gehost door #[a(href='https://www.transip.nl/') TransIP].
</template>
