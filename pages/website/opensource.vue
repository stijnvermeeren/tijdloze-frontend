<template lang="pug">
Title Open source
div
  h2 Open source
  p Tijdloze.rocks is volledig open source. Hulp bij het verbeteren van de layout en de functionaliteiten is steeds welkom. Wie geïnteresseerd is om mee te helpen, mag ons steeds #[nuxt-link(to='/website/contact') contacteren] of meteen op Github aan de slag gaan.

  el-card
    template(#header)
      div.header
        div.title Frontend
        div
          a(href='https://github.com/stijnvermeeren/tijdloze-frontend')
            el-button(round type="primary")
              span Github #[strong stijnvermeeren/tijdloze-frontend]
    p Het #[em frontend] van tijdloze.rocks is een #[em single page application] die geschreven is met #[a(href='https://vuejs.org/') Vue.js] en het framework #[a(href='https://nuxtjs.org/') Nuxt]. De grafieken worden gegenereerd in de browser met de JavaScript library #[a(href='https://d3js.org/') D3.js].
    p De broncode en meer informatie is te vinden in het Github-project #[strong #[a(href='https://github.com/stijnvermeeren/tijdloze-frontend') stijnvermeeren/tijdloze-frontend]].


  el-card
    template(#header)
      div.header
        div.title API
        div
          a(href='https://github.com/stijnvermeeren/tijdloze-api')
            el-button(round type="primary")
              span Github #[strong stijnvermeeren/tijdloze-api]
    p De gegevens van alle nummers en artiesten zijn opgeslagen in een MySQL database. De API die voor de communicatie zorgt tussen datenbank en browser is geschreven in #[a(href='https://www.scala-lang.org/') Scala] met het #[a(href='https://www.playframework.com/') Play Framework].
    p De broncode en meer informatie is te vinden in het Github-project #[strong #[a(href='https://github.com/stijnvermeeren/tijdloze-api') stijnvermeeren/tijdloze-api]].
</template>
