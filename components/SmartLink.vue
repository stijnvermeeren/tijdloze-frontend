<template lang="pug">
span(:class='{bold: isBold}')
  song-link(v-if='song' :song='song')
  artist-link(v-else-if='artist' :artist='artist' :text='input')
  year-link(v-else-if='year' :year='year')
  year-link(v-else-if='yearShort' :year='yearShort' short)
  span(v-else) {{input}}
</template>

<script>
  import Artist from "../orm/Artist";
  import Song from "../orm/Song";
  import {useRootStore} from "~/stores/root";
  import {useRepo} from "pinia-orm";

  export default {
    props: {
      to: String
    },
    computed: {
      years() {
        return useRootStore().years;
      },
      song() {
        const songId = this.findSongId(this.input)
        return songId ? useRepo(Song).find(songId) : undefined
      },
      year() {
        return this.findYear(this.input);
      },
      yearShort() {
        return this.findYearShort(this.input);
      },
      artist() {
        const artistId = this.findArtistId(this.input)
        return artistId ? useRepo(Artist).find(artistId) : undefined
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
        const fullNameMatches = useRootStore().artistIdsByFullName[input.toLowerCase()];
        if (fullNameMatches && fullNameMatches.length === 1) {
          return fullNameMatches[0];
        } else if (fullNameMatches && fullNameMatches.length > 1) {
          return null;
        }

        const lastNameMatches = useRootStore().artistIdsByName[input.toLowerCase()];
        if (lastNameMatches && lastNameMatches.length === 1) {
          return lastNameMatches[0];
        }

        return null;
      },
      findSongId(input) {
        const titleMatches = useRootStore().songIdsByTitle[input.toLowerCase()];
        if (titleMatches && titleMatches.length === 1) {
          return titleMatches[0];
        }

        // fallback behaviour for inputs of the form "One;U2"
        const split = input.split(";");
        if (split.length === 2) {
          const title = split[0].trim();
          const artistName = split[1].trim();

          const titleMatches = useRootStore().songIdsByTitle[title.toLowerCase()];
          if (titleMatches) {
            const combinedMatches = titleMatches.filter(songId => {
              const foundSong = useRepo(Song).find(songId);
              const foundArtistId = this.findArtistId(artistName);
              return foundSong && foundArtistId && foundArtistId === foundSong.artistId;
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
