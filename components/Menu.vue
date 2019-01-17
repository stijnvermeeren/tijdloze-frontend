<template lang="pug">
  div
    #sideNav(:class='{closed: !isOpen}' @click.stop='menuClick($event)')
      nav
        #menu
          tijdloze-search-box(@selectSearchResult='selectSearchResult($event)')
          ul
            li
              nuxt-link(to='/') Home
            li(v-if='!listInProgress')
              nuxt-link(to='/reacties') Reageer en discussieer
            li(v-if='listInProgress')
              nuxt-link(to='/lijst/2018') De Tijdloze 2018
              ul
                li
                  nuxt-link(to='/lijst/opkomst') Nog op komst...
                li
                  nuxt-link(to='/chat') Chatbox
                li
                  nuxt-link(to='/polls') Polls
            li
              nuxt-link(to='/lijsten') De Tijdloze van...
              ul.lists
                template(v-for='(year, index) in years')
                  li(v-if='years.length - index < 3 || allLists' :key='year.yyyy')
                    nuxt-link(:to="'/lijst/' + year.yyyy") {{year.yyyy}}
                li(v-if='!allLists')
                  a(@click.stop='allLists = true') Meer tonen
                li(v-else='')
                  a(@click.stop='allLists = false') Minder tonen
            li
              nuxt-link(to='/artiesten') Alle artiesten
              ul
                li
                  nuxt-link(to='/nummers') Alle nummers
            li
              nuxt-link(to='/statistieken') Statistieken
              ul
                li
                  nuxt-link(to='/tijdlozetijdloze') De Tijdloze Tijdloze
            li
              nuxt-link(to='/website') Over deze website
              ul
                li
                  nuxt-link(to='/website/geschiedenis') Geschiedenis
                li
                  nuxt-link(to='/website/privacy') Privacybeleid
                li
                  nuxt-link(to='/website/opendata') Open data
                li
                  nuxt-link(to='/website/contact') Contact
            li(v-if='isAdmin')
              nuxt-link(to='/admin') Admin
              ul
                li
                  nuxt-link(to='/admin/live') Nummers toevoeren
                li
                  nuxt-link(to='/admin/exits') Exits markeren
                li
                  nuxt-link(to='/admin/polls') Polls
                li
                  nuxt-link(to='/admin/analysis') Interessante feiten
      tijdloze-login
      span.cross-button(@click='isOpen = false')
        span.cross(style='transform: rotate(45deg)')
        span.cross(style='transform: rotate(-45deg)')
    .burger-button(@click.stop='isOpen = true')
      .burger
        span.burger-bars(:style="{top:20 * (index * 2) + '%'}" v-for='(x, index) in 3' :key='index')
</template>

<script>
  import Login from '../components/Login'
  import SearchBox from '../components/SearchBox'

  export default {
    components: {
      tijdlozeLogin: Login,
      tijdlozeSearchBox: SearchBox
    },
    data() {
      return {
        allLists: false,
        isOpen: false
      };
    },
    computed: {
      listInProgress() {
        return this.$store.getters.listInProgress;
      },
      years() {
        return this.$store.getters.years;
      },
      isAdmin() {
        return this.$store.getters.isAdmin;
      }
    },
    methods: {
      selectSearchResult(result) {
        let path = ''

        if (result.type === 'song') {
          path = `/nummer/${result.item.id}`
        } else if (result.type === 'artist') {
          path = `/artiest/${result.item.id}`
        } else if (result.type === 'album') {
          path = `/album/${result.item.id}`
        }
        if (path) {
          this.isOpen = false;
          this.$router.push(path);
        }

      },
      escapeKeyListener: function (evt) {
        if (evt.code === "Escape" && this.isOpen) {
          this.isOpen = false;
        }
      },
      close(e) {
        if (this.isOpen) {
          this.isOpen = false;
        }
      },
      menuClick(event) {
        if (event.target.tagName.toLowerCase() === 'a') {
          this.isOpen = false;
        }
      }
    },
    created: function() {
      if (process.client) {
        document.addEventListener('keyup', this.escapeKeyListener);
        document.addEventListener('click', this.close);
      }
    },
    destroyed: function() {
      if (process.client) {
        document.removeEventListener('keyup', this.escapeKeyListener);
        document.removeEventListener('click', this.close);
      }
    },
  };
</script>


<style lang="less" scoped>
  @import "../assets/globalStyles.less";


  #sideNav {
    box-sizing: border-box;
    height: 100%;
    width: 300px;
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    background-color: @menuBackgroundColor;
    border-right: 2px solid @headerBackgroundColor;
    overflow-x: hidden;
    padding: 1em 2em;
    transition: 0.3s;

    font-size: 115%;
    text-align: right;

    @media (min-width: 1200px) {
      height: 100%;
      min-height: 800px;
      position: relative;
    }


    @media (max-width: 1199px) {
      padding-top: 50px;

      &.closed {
        left: -300px;
      }
    }
  }

  #menu {
    ul {
      .noBullets;
      margin: 0 0 2em;

      li {
        padding: 0.5em 0;
        font-weight: bold;

        ul {
          margin: 0.2em 0 0 0;
          font-size: 90%;

          li {
            margin: 0.2em 0 0.2em 1em;
            padding: 0;
            font-weight: normal;
          }

          &.lists {
            li {
              display: inline-block;
            }
          }
        }
      }
    }
  }

  .burger-button {
    position: absolute;
    width: 56px;
    height: 50px;
    left: 26px;
    top: 20px;
    cursor: pointer;

    @media (min-width: 1200px) {
      display: none;
    }

    .burger {
      position: absolute;
      top: 10px;
      bottom: 10px;
      left: 10px;
      right: 10px;

      .burger-bars {
        background-color: #444;
        position: absolute;
        height: 20%;
        left: 0;
        right: 0;
      }
    }
  }

  .cross-button {
    text-align: center;
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;

    height: 24px;
    width: 24px;

    @media (min-width: 1200px) {
      display: none;
    }

    .cross {
      background-color: #444;
      position: absolute;
      width: 5px;
      height: 24px;
    }
  }
  .bm-overlay {
    background: rgba(0, 0, 0, 0.3);
  }
</style>
