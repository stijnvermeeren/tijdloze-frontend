<template>
    <div>
        <h4>Wat is de Tijdloze Website?</h4>
        <p>De Tijdloze Website verzamelt alle lijsten en bijhorende statistieken van De Tijdloze. De Tijdloze is sinds 1987 de allertijdenlijst van de Vlaamse radiozender <a href="http://stubru.be" title="Website Studio Brussel">Studio Brussel</a>. De Tijdloze wordt bepaald door stemmen van de luisteraars van Studio Brussel en wordt op het einde van elk jaar uitgezonden.</p>
        <p>De Tijdloze Website is volledig <strong>onafhankelijk van Studio Brussel</strong> en de <a href="http://vrt.be">VRT</a>. De Tijdloze Website heeft niets te maken met de samenstelling of het uitzenden van de Tijdloze. De Tijdloze Website dankt wel Studio Brussel voor de hulp met het vervolledigen van de database van deze website.</p>

        <h4>Webmaster</h4>
        <p>De Tijdloze Website wordt beheerd door <strong>Stijn Vermeeren</strong>. U kunt hem een berichtje sturen via het <nuxt-link to="/website/contact">contactformulier</nuxt-link>. Suggesties of verbeteringen voor de website worden ten zeerste geapprecieerd. U kan ook eens een kijkje nemen op de <a href="http://www.stijnvermeeren.be" title="Persoonlijke website Stijn Vermeeren">persoonlijke website</a> van webmaster Stijn.</p>
        <p>In 2014 krijgt Stijn hulp van <strong>Wouter <em>"Link"</em> Verbeke</strong> bij het onderhouden en updaten van de website tijdens de uitzending van de Tijdloze.</p>

        <h4>Technische details</h4>
        <p>De gegevens van alle nummers en artiesten zijn opgeslagen in een MySQL database. Alle statistieken worden automatisch gegenereerd door PHP scripts (met de hulp van het <a href="http://www.yiiframework.com/">Yii framework</a> versie 2.0). Zodanig kan de website de hele tijd up to date blijven, ook tijdens de uitzending van een nieuwe Tijdloze: met één muisklik wordt het volgende nummer toegevoegd en alle statistieken worden automatisch herberekend.</p>
        <p>De chatbox komst van het open source project <a href="https://frug.github.io/AJAX-Chat/">AJAX-Chat</a>. De nieuwe grafieken worden gegenereerd in de browser met de JavaScript library <a href="http://d3js.org/">D3.js</a>.</p>
        <p>De website wordt gehost door <a href="http://www.cloudvps.nl/">CloudVPS</a>.</p>

        <h4>Speciale dank aan...</h4>
        <ul>
            <li><a href="http://stubru.be" title="Website Studio Brussel">Studio Brussel</a> - voor het uitzenden van de Tijdloze, zonder wie er geen Tijdloze Website zou zijn, en voor de hulp bij het vervolledigen van de statistieken.</li>
            <li><a href="http://www.cloudvps.nl/">CloudVPS</a> - voor de webhosting.</li>
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
