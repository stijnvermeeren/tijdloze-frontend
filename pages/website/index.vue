<template>

    <div>
        <h2>Over de Tijdloze Website</h2>

        <h3>Wat is de Tijdloze Website?</h3>
        <p>De Tijdloze Website verzamelt alle lijsten en bijhorende statistieken van De Tijdloze. De Tijdloze is sinds 1987 de allertijdenlijst van de Vlaamse radiozender <a href="http://stubru.be" title="Website Studio Brussel">Studio Brussel</a>. De Tijdloze wordt bepaald door stemmen van de luisteraars van Studio Brussel en wordt op het einde van elk jaar uitgezonden.</p>
        <p>De Tijdloze Website is volledig <strong>onafhankelijk van Studio Brussel</strong> en de <a href="http://vrt.be">VRT</a>. De Tijdloze Website heeft niets te maken met de samenstelling of het uitzenden van de Tijdloze. De Tijdloze Website dankt wel Studio Brussel voor de hulp met het vervolledigen van de database van deze website.</p>

        <h3>Webmaster</h3>
        <p>De Tijdloze Website wordt beheerd door <strong>Stijn Vermeeren</strong>. U kunt hem een berichtje sturen via het <nuxt-link to="/website/contact">contactformulier</nuxt-link>. Suggesties of verbeteringen voor de website worden ten zeerste geapprecieerd. U kan ook eens een kijkje nemen op de <a href="http://www.stijnvermeeren.be" title="Persoonlijke website Stijn Vermeeren">persoonlijke website</a> van webmaster Stijn.</p>
        <p>In 2014 krijgt Stijn hulp van <strong>Wouter <em>"Link"</em> Verbeke</strong> bij het onderhouden en updaten van de website tijdens de uitzending van de Tijdloze.</p>

        <h3>Technische details</h3>
        <p>De website werd gemaakt met het JavaScript framework <a href="https://vuejs.org/">Vue.js</a>, meer bepaald met <a href="https://nuxtjs.org/">Nuxt</a>. De nieuwe grafieken worden gegenereerd in de browser met de JavaScript library <a href="http://d3js.org/">D3.js</a>.</p>
        <p>De gegevens van alle nummers en artiesten zijn opgeslagen in een MySQL database. De API die voor de communicatie zorgt tussen datenbank en browser is geschreven in <a href="https://www.scala-lang.org/">Scala</a> met het <a href="https://www.playframework.com/">Play Framework</a>.</p>
        <p>De website wordt gehost door <a href="http://www.cloudvps.nl/">CloudVPS</a>.</p>

        <h3>Speciale dank aan...</h3>
        <ul>
            <li><a href="http://stubru.be" title="Website Studio Brussel">Studio Brussel</a> - voor het uitzenden van de Tijdloze, zonder wie er geen Tijdloze Website zou zijn, en voor de hulp bij het vervolledigen van de statistieken.</li>
            <li>Kris De Rocker voor de domeinnaam <a href="http://www.detijdloze.be/">detijdloze.be</a>.</li>
            <li>Michaël Arnauts - voor de technische hulp en tips.</li>
            <li>Iedereen die mij tips gemaild heeft of mij op foutjes gewezen heeft - voor het verbeteren van de kwaliteit van deze website.</li>
        </ul>
    </div>
</template>

<script>
  export default {
    head: {
      title: "Website"
    }
  }
</script>
