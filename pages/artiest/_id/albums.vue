<template>
    <div>
        <ul v-if="artist.albums">
            <li v-for="album in artist.albums">
                <tijdloze-album :album="album" /> ({{album.releaseYear}})
                <ul v-if="album.songs">
                    <li v-for="song in album.songs"><tijdloze-song :song="song" /></li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
  export default {
    props: ['artist']
  }
</script>
