<template>
    <table class="lijst perVijf">
        <tbody>
        <tr>
            <th class="r">
                {{year._yy}}
            </th>
            <th class="a">
                <nuxt-link to="/artiesten">Artiest</nuxt-link>
            </th>
            <th>
                <nuxt-link to="/nummers">Titel</nuxt-link>
            </th>
            <th></th>
            <th>
                Jaar
            </th>
        </tr>
        <tr v-for="song in newSongs">
            <td class="r">
                <tijdloze-position :song="song" :year="year" />
            </td>
            <td class="a">
                <tijdloze-artist :artist="$store.getters.artistsById[song.artistId]" />
            </td>
            <td>
                <tijdloze-song :song="song" />
            </td>
            <td>
                <span v-if="song.isReEntry(year)">Re-entry</span>
            </td>
            <td>
                {{song.releaseYear}}
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
  export default {
    props: ["year", "newSongs"]
  }
</script>
