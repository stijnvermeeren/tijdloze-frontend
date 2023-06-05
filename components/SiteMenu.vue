<template lang="pug">
div
  #sideNav(:class='{closed: !isOpen}' @click.stop='menuClick($event)')
    search-box(@selectSearchResult='selectSearchResult($event)')

    nav
      el-menu(
        :default-openeds="openeds"
        :default-active="route"
        background-color="#fadfbb"
        text-color="#003388"
      )
        nuxt-link(to="/")
          el-menu-item(index="/") Home
        nuxt-link(v-if='commentsOn' to="/reacties")
          el-menu-item(index="/reacties") Reageer en discussieer
        el-sub-menu(v-if='listInProgress' index="inprogress")
          template(#title) De Tijdloze {{currentYear.yyyy}}
          nuxt-link(:to="`/lijst/${currentYear.yyyy}`")
            el-menu-item(:index="`/lijst/${currentYear.yyyy}`") De lijst
          nuxt-link(to="/lijst/opkomst")
            el-menu-item(index="/lijst/opkomst") Nog op komst...
          nuxt-link(v-if="chatOn" to="/chat")
            el-menu-item(index="/chat") Chatbox
          nuxt-link(to="/polls")
            el-menu-item(index="/polls") Polls
        el-sub-menu(index="/lijst")
          template(#title) De Tijdloze van...
          nuxt-link(v-for='year in years' :key='year.yyyy' :to='`/lijst/${year.yyyy}`')
            el-menu-item(:index='`/lijst/${year.yyyy}`') {{year.yyyy}}
        nuxt-link(to="/database")
          el-menu-item(index="/database") Volledige database
        el-sub-menu(index="/statistieken")
          template(#title)
            span Statistieken #[span.addition (top 100)]
          el-menu-item-group(title="Verschuivingen")
            nuxt-link(to="/statistieken/nieuwkomers")
              el-menu-item(index="/statistieken/nieuwkomers") Nieuwkomers
            nuxt-link(to="/statistieken/reentries")
              el-menu-item(index="/statistieken/reentries") Re-entries
            nuxt-link(to="/statistieken/exits")
              el-menu-item(index="/statistieken/exits") Exits
            nuxt-link(to="/statistieken/eenjaarsvliegen")
              el-menu-item(index="/statistieken/eenjaarsvliegen") Eenjaarsvliegen
            nuxt-link(to="/statistieken/stijgers")
              el-menu-item(index="/statistieken/stijgers") Stijgers
            nuxt-link(to="/statistieken/dalers")
              el-menu-item(index="/statistieken/dalers") Dalers
            nuxt-link(to="/statistieken/stationair")
              el-menu-item(index="/statistieken/stationair") Stationaire nummers
          el-menu-item-group(title="Andere statistieken")
            nuxt-link(to="/statistieken/noteringen")
              el-menu-item(index="/statistieken/noteringen") Noteringen
            nuxt-link(to="/statistieken/noteringen_album")
              el-menu-item(index="/statistieken/noteringen_album") Noteringen (Albums)
            nuxt-link(to="/statistieken/landen")
              el-menu-item(index="/statistieken/landen") Landen
            nuxt-link(to="/statistieken/talen")
              el-menu-item(index="/statistieken/talen") Talen
            nuxt-link(to="/statistieken/leadvocals")
              el-menu-item(index="/statistieken/leadvocals") Lead vocals
            nuxt-link(to="/statistieken/decennia")
              el-menu-item(index="/statistieken/decennia") Decennia
            nuxt-link(to="/statistieken/leeftijden")
              el-menu-item(index="/statistieken/leeftijden") Leeftijden
        el-sub-menu(index="/website")
          template(#title) Deze website
          nuxt-link(to="/website")
            el-menu-item(index="/website") Algemene info
          nuxt-link(to="/website/geschiedenis")
            el-menu-item(index="/website/geschiedenis") Geschiedenis
          nuxt-link(to="/website/methodologie")
            el-menu-item(index="/website/methodologie") Methodologie
          nuxt-link(to="/website/opendata")
            el-menu-item(index="/website/opendata") Open data
          nuxt-link(to="/website/opensource")
            el-menu-item(index="/website/opensource") Open source
          nuxt-link(to="/website/privacy")
            el-menu-item(index="/website/privacy") Privacybeleid
          nuxt-link(to="/website/contact")
            el-menu-item(index="/website/contact") Contact
        el-sub-menu(v-if='isAdmin' index="/admin")
          template(#title) Admin
          nuxt-link(to="/admin/live")
            el-menu-item(index="/admin/live") Nummers toevoegen
          nuxt-link(to="/admin/exits")
            el-menu-item(index="/admin/exits") Exits markeren
          nuxt-link(to="/admin/polls")
            el-menu-item(index="/admin/polls") Polls
          nuxt-link(to="/admin/analysis")
            el-menu-item(index="/admin/analysis") Interessante feiten
          nuxt-link(to="/admin/artist")
            el-menu-item(index="/admin/artist") Nieuwe artiest
          nuxt-link(to="/admin/users")
            el-menu-item(index="/admin/users") Gebruikers
          nuxt-link(to="/admin/settings")
            el-menu-item(index="/admin/settings") Instellingen

    login
    span.cross-button(@click='isOpen = false')
      span.cross(style='transform: rotate(45deg)')
      span.cross(style='transform: rotate(-45deg)')
  .burger-button(@click.stop='isOpen = true')
    .burger
      span.burger-bars(:style="{top:20 * (index * 2) + '%'}" v-for='(x, index) in 3' :key='index')
</template>

<script>
  import {useRootStore} from "~/stores/root";
  import {useAuthStore} from "~/stores/auth";

  export default defineNuxtComponent({
    data() {
      return {
        isOpen: false
      };
    },
    computed: {
      commentsOn() {
        return useRootStore().commentsOn;
      },
      chatOn() {
        return useRootStore().chatOn;
      },
      listInProgress() {
        return useRootStore().listInProgress;
      },
      currentYear() {
        return useRootStore().currentYear;
      },
      years() {
        return [...useRootStore().years].reverse();
      },
      isAdmin() {
        return useAuthStore().isAdmin;
      },
      route() {
        return this.$route.path.split('/').slice(0, 3).join('/');
      },
      openeds() {
        const mainPath = this.$route.path.split('/').slice(0, 2).join('/');
        return ['inprogress', '/admin', mainPath];
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
    ssrComputedCache: true
  });
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
    top: 10px;
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

    span.addition {
      font-size: 12px;
      font-weight: normal;
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
    .el-menu-item, .el-sub-menu__title {
      font-size: 16px;
      font-weight: bold;
      height: 40px;
      line-height: 40px;
    }
  }
</style>