<template lang="pug">
  span(:class='{bold: isBold}')
    tijdloze-song(v-if='song' :song='song')
    tijdloze-artist(v-else-if='artist' :artist='artist' :text='input')
    tijdloze-year(v-else-if='year' :year='year')
    tijdloze-year-short(v-else-if='yearShort' :year='yearShort')
    span(v-else) {{input}}
</template>

<script>
  import Song from "@/orm/Song";
  import Artist from "@/orm/Artist";

  export default {
    props: ["to"],
    computed: {
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
        const fullNameMatches = this.$store.getters.artistsFullNameForLinks[input.toLowerCase()];
        if (fullNameMatches && fullNameMatches.length === 1) {
          return fullNameMatches[0];
        } else if (fullNameMatches && fullNameMatches.length > 1) {
          return null;
        }

        const lastNameMatches = this.$store.getters.artistsNameForLinks[input.toLowerCase()];
        if (lastNameMatches && lastNameMatches.length === 1) {
          return lastNameMatches[0];
        }

        return null;
      },
      findSong(input) {
        const titleMatches = this.$store.getters.songsForLinks[input.toLowerCase()];
        if (titleMatches && titleMatches.length === 1) {
          return titleMatches[0];
        }

        // fallback behaviour for inputs of the form "One;U2"
        const split = input.split(";");
        if (split.length === 2) {
          const title = split[0].trim();
          const artistName = split[1].trim();

          const titleMatches = this.$store.getters.songsForLinks[title.toLowerCase()];
          if (titleMatches) {
            const combinedMatches = titleMatches.filter(song => {
              const foundArtist = this.findArtist(artistName);
              return foundArtist && foundArtist.id === song.artistId;
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
