<template lang="pug">
  span(:class='{bold: isBold}')
    tijdloze-song(v-if='song' :song='song')
    tijdloze-artist(v-else-if='artist' :artist='artist' :text='input')
    tijdloze-year(v-else-if='year' :year='year')
    tijdloze-year-short(v-else-if='yearShort' :year='yearShort')
    span(v-else) {{input}}
</template>

<script>
  import Artist from "../orm/Artist";
  import Song from "../orm/Song";

  export default {
    props: {
      to: String
    },
    computed: {
      years() {
        return this.$store.getters.years;
      },
      song() {
        const songId = this.findSongId(this.input)
        return songId ? Song.find(songId) : undefined
      },
      year() {
        return this.findYear(this.input);
      },
      yearShort() {
        return this.findYearShort(this.input);
      },
      artist() {
        const artistId = this.findArtistId(this.input)
        return artistId ? Artist.find(artistId) : undefined
      },
      isBold() {
        return this.to.startsWith("*");
      },
      input() {
        if (this.to.startsWith("*")) {
          return this.to.substring(1).trim();
        } else {
          return this.to.trim();
        }
      }
    },
    methods: {
      findYear(input) {
        return this.years.find(year => year.yyyy.toString() === input);
      },
      findYearShort(input) {
        return this.years.find(year => year._yy === input);
      },
      findArtistId(input) {
        const fullNameMatches = this.$store.state.artistIdsByFullName[input.toLowerCase()];
        if (fullNameMatches && fullNameMatches.length === 1) {
          return fullNameMatches[0];
        } else if (fullNameMatches && fullNameMatches.length > 1) {
          return null;
        }

        const lastNameMatches = this.$store.state.artistIdsByName[input.toLowerCase()];
        if (lastNameMatches && lastNameMatches.length === 1) {
          return lastNameMatches[0];
        }

        return null;
      },
      findSongId(input) {
        const titleMatches = this.$store.state.songIdsByTitle[input.toLowerCase()];
        if (titleMatches && titleMatches.length === 1) {
          return titleMatches[0];
        }

        // fallback behaviour for inputs of the form "One;U2"
        const split = input.split(";");
        if (split.length === 2) {
          const title = split[0].trim();
          const artistName = split[1].trim();

          const titleMatches = this.$store.state.songIdsByTitle[title.toLowerCase()];
          if (titleMatches) {
            const combinedMatches = titleMatches.filter(song => {
              const foundArtistId = this.findArtistId(artistName);
              return foundArtistId && foundArtistId === song.artistId;
            });

            if (combinedMatches.length === 1) {
              return combinedMatches[0];
            }
          }
        }

        return null;
      }
    }
  }
</script>

<style lang="scss" scoped>
    span.bold {
        font-weight: bold;
    }
</style>
