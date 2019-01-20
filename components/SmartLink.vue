<template lang="pug">
  span(:class='{bold: isBold}')
    tijdloze-song(v-if='song' :song='song')
    tijdloze-artist(v-else-if='artist' :artist='artist' :text='input')
    tijdloze-year(v-else-if='year' :year='year')
    tijdloze-year-short(v-else-if='yearShort' :year='yearShort')
    span(v-else) {{input}}
</template>

<script>
  export default {
    props: ["to"],
    computed: {
      artists() {
        return this.$store.getters['entities/artists/all']();
      },
      songs() {
        return this.$store.getters['entities/songs/all']();
      },
      years() {
        return this.$store.getters.years;
      },
      song() {
        return this.findSong(this.input);
      },
      year() {
        return this.findYear(this.input);
      },
      yearShort() {
        return this.findYearShort(this.input);
      },
      artist() {
        return this.findArtist(this.input);
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

<style lang="less" scoped>
    span.bold {
        font-weight: bold;
    }
</style>
