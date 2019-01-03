<template>

    <div>
        <h2>Open data</h2>

        <p>Alle statistieken op deze website baseren zich op en database van alle Tijdloze lijsten. Deze database kan in verschillende formaten worden gedownload.</p>

        <h3>MySQL (relationele datenbank)</h3>
        <p>Onderstaande MySQL-export bevat de structuur en de gegevens van vier tabellen:</p>
        <ul>
            <li><em>artist</em>: alle artiesten.</li>
            <li><em>album</em>: alle albums, met een foreign key die naar <em>artist</em> verwijst.</li>
            <li><em>song</em>: alle nummers, met foreign keys die naar <em>artist</em> en <em>album</em> verwijzen.</li>
            <li><em>list_entry</em>: alle noteringen in alle edities van de Tijdloze, met een foreign key die naar <em>song</em> verwijst.</li>
        </ul>
        <p><a href="/data/tijdloze.sql">Download <strong>tijdloze.sql</strong></a></p>

        <h3>Tab-separated file (bv. voor Excel)</h3>
        <p>Onderstaande TSV-export is een bestand met waardes die met tabs gescheiden zijn. Dit bestand bevat een <em>vlakke</em> versie van de belangrijkste gegevens uit de bovenstaande MySQL-export. Alle artiesten, albums, nummers en noteringen werden hier dus in één tabel samengevat. Dit bestand kan gelezen worden door programma's zoals Microsoft Excel.</p>
        <p><a href="/data/tijdloze.tsv">Download <strong>tijdloze.tsv</strong></a></p>
    </div>
</template>

<script>
  export default {
    head: {
      title: "Open Data"
    }
  }
</script>
