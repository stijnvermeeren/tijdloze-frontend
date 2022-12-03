<template lang="pug">
  div
    #sideNav(:class='{closed: !isOpen}' @click.stop='menuClick($event)')
      tijdloze-search-box(@selectSearchResult='selectSearchResult($event)')

      nav
        el-menu(
          router
          :default-openeds="openeds"
          :default-active="route"
          background-color="inherit"
          text-color="#003388"
        )
          el-menu-item(index="/") Home
          el-menu-item(v-if='!listInProgress' index="/reacties") Reageer en discussieer
          el-submenu(v-if='listInProgress' index="inprogress")
            template(slot="title") De Tijdloze {{currentYear.yyyy}}
            el-menu-item(:index="`/lijst/${currentYear.yyyy}`") De lijst
            el-menu-item(index="/lijst/opkomst") Nog op komst...
            el-menu-item(index="/chat") Chatbox
            el-menu-item(index="/polls") Polls
          el-submenu(index="/lijst")
            template(slot="title") De Tijdloze van...
            el-menu-item(v-for='year in years' :index='`/lijst/${year.yyyy}`' :key='year.yyyy') {{year.yyyy}}
          el-menu-item(index="/database") Volledige database
          el-submenu(index="/statistieken")
            template(slot="title") Statistieken
            el-menu-item-group(title="Verschuivingen")
              el-menu-item(index="/statistieken/nieuwkomers") Nieuwkomers
              el-menu-item(index="/statistieken/reentries") Re-entries
              el-menu-item(index="/statistieken/exits") Exits
              el-menu-item(index="/statistieken/eenjaarsvliegen") Eenjaarsvliegen
              el-menu-item(index="/statistieken/stijgers") Stijgers
              el-menu-item(index="/statistieken/dalers") Dalers
              el-menu-item(index="/statistieken/stationair") Stationaire nummers
            el-menu-item-group(title="Andere statistieken")
              el-menu-item(index="/statistieken/noteringen") Noteringen
              el-menu-item(index="/statistieken/noteringen_album") Noteringen (Albums)
              el-menu-item(index="/statistieken/landen") Landen
              el-menu-item(index="/statistieken/talen") Talen
              el-menu-item(index="/statistieken/leadvocals") Lead vocals
              el-menu-item(index="/statistieken/decennia") Decennia
              el-menu-item(index="/statistieken/leeftijden") Leeftijden
          el-submenu(index="/website")
            template(slot="title") Deze website
            el-menu-item(index="/website") Algemene info
            el-menu-item(index="/website/geschiedenis") Geschiedenis
            el-menu-item(index="/website/methodologie") Methodologie
            el-menu-item(index="/website/opendata") Open data
            el-menu-item(index="/website/opensource") Open source
            el-menu-item(index="/website/privacy") Privacybeleid
            el-menu-item(index="/website/contact") Contact
          el-submenu(v-if='isAdmin' index="/admin")
            template(slot="title") Admin
            el-menu-item(index="/admin/live") Nummers toevoegen
            el-menu-item(index="/admin/lijst") Nummers verwijderen
            el-menu-item(index="/admin/exits") Exits markeren
            el-menu-item(index="/admin/polls") Polls
            el-menu-item(index="/admin/analysis") Interessante feiten
            el-menu-item(index="/admin/artist") Nieuwe artiest
            el-menu-item(index="/admin/users") Gebruikers
            el-menu-item(index="/admin/comments") Verwijderde reacties
            el-menu-item(index="/admin/settings") Instellingen

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
        isOpen: false
      };
    },
    computed: {
      listInProgress() {
        return this.$store.getters.listInProgress;
      },
      currentYear() {
        return this.$store.getters.currentYear;
      },
      years() {
        return [...this.$store.getters.years].reverse();
      },
      isAdmin() {
        return this.$store.getters['auth/isAdmin'];
      },
      route() {
        return this.$route.path.split('/').slice(0, 3).join('/');
      },
      openeds() {
        const mainPath = this.$route.path.split('/').slice(0, 2).join('/');
        return ['inprogress', mainPath];
      }
    },
    methods: {
      selectSearchResult(result) {
        let path = ''

        if (result.type === 'song') {
          path = `/nummer/${result.item.id}-${result.item.slug}`
        } else if (result.type === 'artist') {
          path = `/artiest/${result.item.id}-${result.item.slug}`
        } else if (result.type === 'album') {
          path = `/album/${result.item.id}-${result.item.slug}`
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


<style lang="scss" scoped>
  @use "../assets/styleConfig";

  #sideNav {
    box-sizing: border-box;
    height: 100%;
    width: 300px;
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    background-color: styleConfig.$menuBackgroundColor;
    border-right: 2px solid styleConfig.$headerBackgroundColor;
    overflow-x: hidden;
    padding: 1em 2em;
    transition: 0.3s;

    font-size: 115%;

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


  #sideNav {
    .el-menu {
      border: none;
    }

    .el-menu--inline .el-menu-item {
      font-size: 14px;
      font-weight: normal;
      height: 28px;
      line-height: 28px;
    }
  }
</style>

<style lang="scss">
  #sideNav {
    .el-menu-item, .el-submenu__title {
      font-size: 16px;
      font-weight: bold;
      height: 40px;
      line-height: 40px;
    }
  }
</style>