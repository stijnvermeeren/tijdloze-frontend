<template>
    <span>
        <tijdloze-song v-if="song" :song="song" />
        <tijdloze-artist v-else-if="artist" :artist="artist" />
        <span v-else="artist">{{to}}</span>
    </span>
</template>

<script>
  export default {
    props: ["to"],
    computed: {
      artists() {
        return this.$store.getters.artists;
      },
      songs() {
        return this.$store.getters.songs;
      },
      song() {
        return this.findSong(this.to.trim());
      },
      artist() {
        return this.findArtist(this.to.trim());
      }
    },
    methods: {
      findArtist(input) {
        const fullNameMatches = this.artists.filter(artist => artist.fullName.toLowerCase() === input.toLowerCase());
        if (fullNameMatches.length === 1) {
          return fullNameMatches[0];
        } else if (fullNameMatches.length > 1) {
          return null;
        }

        const lastNameMatches = this.artists.filter(artist => artist.name.toLowerCase() === input.toLowerCase());
        if (lastNameMatches.length === 1) {
          return lastNameMatches[0];
        }

        return null;
      },
      findSong(input) {
        const split = this.to.split(";");

        if (split.length === 1) {
          const titleMatches = this.songs.filter(song => song.title.toLowerCase() === input.toLowerCase());
          if (titleMatches.length === 1) {
            return titleMatches[0];
          }
        }

        if (split.length === 2) {
          const title = split[0].trim();
          const artistName = split[1].trim();

          const fullNameMatches = this.songs.filter(song => {
            if (song.title.toLowerCase() === title.toLowerCase()) {
              const foundArtist = this.findArtist(artistName);
              return foundArtist && foundArtist.id === song.artistId;
            } else {
              return false;
            }
          });

          if (fullNameMatches.length === 1) {
            return fullNameMatches[0];
          }
        }

        return null;
      }
    }
  }
</script>
