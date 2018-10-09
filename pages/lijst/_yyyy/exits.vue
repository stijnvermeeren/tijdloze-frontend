<template>
    <table class="lijst perVijf">
        <tbody>
            <tr>
                <th class="r">
                    {{year.previous()._yy}}
                </th>
                <th class="a">
                    <nuxt-link to="/artiesten">Artiest</nuxt-link>
                </th>
                <th>
                    <nuxt-link to="/nummers">Titel</nuxt-link>
                </th>
                <th>
                    Jaar
                </th>
            </tr>
            <tr v-for="song in exits">
                <td class="r">
                    <tijdloze-position :song="song" :year="year.previous()" />
                </td>
                <td class="a">
                    <tijdloze-artist :artist="song.artist" />
                </td>
                <td>
                    <tijdloze-song :song="song" />
                </td>
                <td>
                    {{song.album.releaseYear}}
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
  export default {
    props: ["year", "exits"]
  }
</script>
