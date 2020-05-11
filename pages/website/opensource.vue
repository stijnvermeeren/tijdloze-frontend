<template lang="pug">
  div
    h2 Open source
    p De Tijdloze Website is volledig open source. Hulp bij het verbeteren van de layout en de functionaliteiten is steeds welkom. Wie geïnteresseerd is om mee te helpen, mag me steeds #[nuxt-link(to='/website/contact') contacteren] of meteen op Github aan de slag gaan.

    h3 Frontend
    p Het #[em frontend] van de Tijdloze Website is een #[em single page application] die geschreven is met #[a(href='https://vuejs.org/') Vue.js] en het framework #[a(href='https://nuxtjs.org/') Nuxt]. De broncode en meer informatie is te vinden in het Github-project #[strong #[a(href='https://github.com/stijnvermeeren/tijdloze-frontend') stijnvermeeren/tijdloze-frontend]].

    h3 API
    p In de achtergrond wordt de Tijdloze Website aangedreven door een #[em API] die geschreven is met #[a(href='https://www.scala-lang.org/') Scala] en het framework #[a(href='https://www.playframework.com/') Play]. De broncode en meer informatie is te vinden in het Github-project #[strong #[a(href='https://github.com/stijnvermeeren/tijdloze-api') stijnvermeeren/tijdloze-api]].

</template>

<script>
  export default {
    head: {
      title: "Open source"
    }
  }
</script>
