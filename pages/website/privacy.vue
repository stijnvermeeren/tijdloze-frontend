<template lang="pug">
  div
    h2 Privacybeleid

    el-card
      div.header(slot="header")
        div.title Registeren en aanmelden
      p Voor enkele functies van de Tijdloze Website (zoals de kommentaarfunctie en de chatbox) is een aanmelding noodzakelijk. Iedere registratie en login verloopt via de dienst #[a(href='https://auth0.com/') Auth0]. Voor gebruikers die met gebruikersnaam en wachtwoord registreren, wordt het wachtwoord veilig bewaard door Auth0 en niet met de Tijdloze Website gedeeld. Aan gebruikers die zich via andere diensten (bijvoorbeeld Facebook of Google) aanmelden, wordt toestemming gevraagd om enkel de meeste essentiële gegevens te delen met Auth0 en met de Tijdloze Website, namelijk:
      ul
        li Naam / gebruikersnaam: deze wordt overgenomen als gebruikersnaam voor de Tijdloze Website, tenzij de bezoeker zelf een andere gebruikersnaam voor de Tijdloze Website kiest. De gekozen gebruikersnaam is de enige persoonlijke informatie die zichtbaar is voor andere bezoekers van de Tijdloze Website.
        li E-mailadres: wordt gebruikt om te kunnen antwoorden op vragen van de gebruiker en om indien nodig de identiteit van de gebruiker te controleren. Het e-mailadres van een gebruiker wordt nooit getoond aan andere bezoekers.
      p Bij alle aangemelde bezoekers worden er cookies geplaatst om ervoor te zorgen dat het aanmelden niet steeds nodig is bij elk volgend bezoek aan de Tijdloze Website.
      p Indien een aangemelde gebruiker wenst om de eigen gebruikersaccount volledig te verwijderen en alle persoonlijke gegevens te laten wissen uit de databank van de Tijdloze Website, dan kan dit door een aanvraag te sturen via het #[nuxt-link(to='/website/contact') contactformulier].

    el-card
      div.header(slot="header")
        div.title Analytics
      p De Tijdloze Website maakt gebruik van #[a(href='https://analytics.google.com/analytics/') Google Analytics] om bezoekersstatistieken op te stellen (bijvoorbeeld hoe vaak een bepaalde pagina per dag bezocht wordt) en het algemene gedrag van bezoekers te analyseren (bijvoorbeeld op welke links vaak geklikt wordt). Google Analytics gebruikt cookies om de statistieken correct op te stellen.
</template>

<script>
    export default {
      head: {
        title: "Privacybeleid"
      }
    }
</script>
