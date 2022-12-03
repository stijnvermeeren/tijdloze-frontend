<template lang="pug">
  div
    h2 Over de Tijdloze Website

    p De Tijdloze Website verzamelt alle lijsten en bijhorende statistieken van De Tijdloze. De Tijdloze is sinds 1987 de allertijdenlijst van de Vlaamse radiozender #[a(href='http://stubru.be' title='Website Studio Brussel') Studio Brussel]. De Tijdloze wordt bepaald door stemmen van de luisteraars van Studio Brussel en wordt op het einde van elk jaar uitgezonden.
    p De Tijdloze Website is volledig #[strong onafhankelijk van Studio Brussel] en de #[a(href='http://vrt.be') VRT]. De Tijdloze Website heeft niets te maken met de samenstelling of het uitzenden van de Tijdloze. De Tijdloze Website dankt wel Studio Brussel voor de hulp met het vervolledigen van de database van deze website.

    el-card
      div.header(slot="header")
        div.title Team
        div
          nuxt-link(to="/website/contact")
            el-button(round type="primary") Contact
      p De Tijdloze Website wordt beheerd door #[strong Stijn Vermeeren]. U kunt hem een berichtje sturen via het #[nuxt-link(to='/website/contact') contactformulier]. Suggesties of verbeteringen voor de website worden ten zeerste geapprecieerd. U kan ook eens een kijkje nemen op de #[a(href='http://www.stijnvermeeren.be' title='Persoonlijke website Stijn Vermeeren') persoonlijke website] van webmaster Stijn.
      p Sinds 2014 krijgt Stijn hulp van #[strong Wouter #[em "Link"] Verbeke] bij het onderhouden en updaten van de website tijdens de uitzending van de Tijdloze, en sinds 2021 ook van #[strong Dries Wellekens].
      p Speciale dank aan...
      ul
        li #[a(href='http://stubru.be' title='Website Studio Brussel') Studio Brussel] - voor het uitzenden van de Tijdloze, zonder wie er geen Tijdloze Website zou zijn, en voor de hulp bij het vervolledigen van de statistieken.
        li Kris De Rocker voor de domeinnaam #[a(href='http://www.detijdloze.be/') detijdloze.be].
        li De vlag-icoontjes komen van #[a(href='https://flagpedia.net') Flagpedia].
        li Iedereen die mij tips gemaild heeft of mij op foutjes gewezen heeft - voor het verbeteren van de kwaliteit van deze website.

    el-card
      div.header(slot="header")
        div.title Technologie
        div
          nuxt-link(to="/website/opensource")
            el-button(round type="primary") Open source
      p De Tijdloze website is volledig #[nuxt-link(to='/website/opensource') open source]. Iedereen mag de broncode mag bekijken en hergebruiken.
      p Hulp bij het verbeteren van de layout en de functionaliteiten is steeds welkom. Wie geïnteresseerd is om mee te helpen, mag me steeds #[nuxt-link(to='/website/contact') contacteren] of meteen op Github aan de slag gaan.
      p De website wordt gehost door #[a(href='http://www.cloudvps.nl/') CloudVPS].
</template>

<script>
  export default {
    head: {
      title: "Website"
    }
  }
</script>
