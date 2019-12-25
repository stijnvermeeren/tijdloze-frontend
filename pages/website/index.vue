<template lang="pug">
  div
    h2 Over de Tijdloze Website

    h3 Wat is de Tijdloze Website?
    p De Tijdloze Website verzamelt alle lijsten en bijhorende statistieken van De Tijdloze. De Tijdloze is sinds 1987 de allertijdenlijst van de Vlaamse radiozender #[a(href='http://stubru.be' title='Website Studio Brussel') Studio Brussel]. De Tijdloze wordt bepaald door stemmen van de luisteraars van Studio Brussel en wordt op het einde van elk jaar uitgezonden.
    p De Tijdloze Website is volledig #[strong onafhankelijk van Studio Brussel] en de #[a(href='http://vrt.be') VRT]. De Tijdloze Website heeft niets te maken met de samenstelling of het uitzenden van de Tijdloze. De Tijdloze Website dankt wel Studio Brussel voor de hulp met het vervolledigen van de database van deze website.

    h3 Webmaster
    p De Tijdloze Website wordt beheerd door #[strong Stijn Vermeeren]. U kunt hem een berichtje sturen via het #[nuxt-link(to='/website/contact') contactformulier]. Suggesties of verbeteringen voor de website worden ten zeerste geapprecieerd. U kan ook eens een kijkje nemen op de #[a(href='http://www.stijnvermeeren.be' title='Persoonlijke website Stijn Vermeeren') persoonlijke website] van webmaster Stijn.
    p Sinds 2014 krijgt Stijn hulp van #[strong Wouter #[em "Link"] Verbeke] bij het onderhouden en updaten van de website tijdens de uitzending van de Tijdloze.

    h3 Technische details
    p De website werd gemaakt met het JavaScript framework #[a(href='https://vuejs.org/') Vue.js], meer bepaald met #[a(href='https://nuxtjs.org/') Nuxt]. De nieuwe grafieken worden gegenereerd in de browser met de JavaScript library #[a(href='http://d3js.org/') D3.js].
    p De gegevens van alle nummers en artiesten zijn opgeslagen in een MySQL database. De API die voor de communicatie zorgt tussen datenbank en browser is geschreven in #[a(href='https://www.scala-lang.org/') Scala] met het #[a(href='https://www.playframework.com/') Play Framework].
    p De website wordt gehost door #[a(href='http://www.cloudvps.nl/') CloudVPS].

    h3 Speciale dank aan...
    ul
      li #[a(href='http://stubru.be' title='Website Studio Brussel') Studio Brussel] - voor het uitzenden van de Tijdloze, zonder wie er geen Tijdloze Website zou zijn, en voor de hulp bij het vervolledigen van de statistieken.
      li Kris De Rocker voor de domeinnaam #[a(href='http://www.detijdloze.be/') detijdloze.be].
      li Michaël Arnauts - voor de technische hulp en tips.
      li Iedereen die mij tips gemaild heeft of mij op foutjes gewezen heeft - voor het verbeteren van de kwaliteit van deze website.
</template>

<script>
  export default {
    head: {
      title: "Website"
    }
  }
</script>
