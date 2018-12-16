<template>
  <div>
    <div v-if="songs.length">
      <table class="lijst" ref="list">
        <tbody>
        <tr>
          <th v-if="year.previous()" class="n">
            <nuxt-link :to="`/lijst/${year.previous().yyyy}`">{{year.previous()._yy}}</nuxt-link>
          </th>
          <th class="r">{{year._yy}}</th>
          <th v-if="year.next()" class="n">
            <nuxt-link :to="`/lijst/${year.next().yyyy}`">{{year.next()._yy}}</nuxt-link>
          </th>
          <th class="a">
            <nuxt-link to="/artiesten">Artiest</nuxt-link>
          </th>
          <th>
            <nuxt-link to="/nummers">Titel</nuxt-link>
          </th>
          <th class="releaseYear">
            Jaar
          </th>
        </tr>
        <tr v-for="song in shownSongs" :key="song.id" :class="{lineAfter: song.position(year, true) % 5 === 0}">
          <td v-if="year.previous()" class="n">
            <tijdloze-position :song="song" :year="year.previous()" />
          </td>
          <td class="r">
            <tijdloze-position-change :song="song" :year="year" />
            <tijdloze-position :song="song" :year="year" />
          </td>
          <td v-if="year.next()" class="n">
            <tijdloze-position :song="song" :year="year.next()" />
          </td>
          <td class="a">
            <tijdloze-artist :artist="song.artist" />
          </td>
          <td>
            <tijdloze-song :song="song" />
          </td>
          <td class="releaseYear">
            {{song.album.releaseYear}}
          </td>
        </tr>
        </tbody>
      </table>
      <div v-if="collapsable" @click.prevent="toggle()" class="collapseLink">
        <div v-if="collapsed">
          <a>Toon de hele lijst</a>
        </div>
        <div v-else>
          <a>Minder tonen</a>
        </div>
      </div>
    </div>
    <p v-else>Nog geen nummers in de Tijdloze van {{year.yyyy}}.</p>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'FullList',
    props: {
      year: {
        type: Object
      },
      songs: {
        type: Array
      }
    },
    data() {
      return {
        collapsed: true
      }
    },
    computed: {
      collapsable() {
        return this.songs.length > 10
      },
      shownSongs() {
        if (this.collapsable && this.collapsed) {
          return _.take(this.songs, 10);
        } else {
          return this.songs;
        }
      }
    },
    methods: {
      toggle() {
        this.collapsed = !this.collapsed;
        if (this.collapsed) {
          const element = this.$refs['list'];
          console.log(element)
          element.scrollIntoView({block: "start"});
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  div.collapseLink {
    text-align: center;
    font-weight: bold;
  }

  .releaseYear {
    @media (max-width: 660px) {
      display: none;
    }
  }
</style>
