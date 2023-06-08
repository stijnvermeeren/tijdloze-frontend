<template lang="pug">
div
  #sideNav(:class='{closed: !isOpen}' @click.stop='menuClick($event)')
    search-box(@selectSearchResult='selectSearchResult($event)')

    nav
      v-list(bg-color="#fadfbb" density="comfortable" :opened="openeds")
        v-list-item(to="/") Home
        v-list-item(v-if='commentsOn' to="/reacties") Reageer en discussieer
        v-list-group(v-if='listInProgress' value="/inprogress")
          template(#activator="{ props }")
            v-list-item(v-bind="props") De Tijdloze {{currentYear.yyyy}}
          v-list-item(:to="`/lijst/${currentYear.yyyy}`") De lijst
          v-list-item(to="/lijst/opkomst") Nog op komst...
          v-list-item(v-if="chatOn" to="/chat") Chatbox
          v-list-item(to="/polls") Polls
        v-list-group(value="/lijst")
          template(#activator="{ props }")
            v-list-item(v-bind="props") De Tijdloze van ...
          v-list-item(v-for='year in years' :key='year.yyyy' :to='`/lijst/${year.yyyy}`') {{year.yyyy}}
        v-list-item(to="/database") Volledige database
        v-list-group(value="/statistieken")
          template(#activator="{ props }")
            v-list-item(v-bind="props") Statistieken #[span.addition (top 100)]
          v-list-subheader(title="Verschuivingen")
          v-list-item(to="/statistieken/nieuwkomers") Nieuwkomers
          v-list-item(to="/statistieken/reentries") Re-entries
          v-list-item(to="/statistieken/exits") Exits
          v-list-item(to="/statistieken/eenjaarsvliegen") Eenjaarsvliegen
          v-list-item(to="/statistieken/stijgers") Stijgers
          v-list-item(to="/statistieken/dalers") Dalers
          v-list-item(to="/statistieken/stationair") Stationaire nummers
          v-list-subheader(title="Andere statistieken")
          v-list-item(to="/statistieken/noteringen") Noteringen
          v-list-item(to="/statistieken/noteringen_album") Noteringen (Albums)
          v-list-item(to="/statistieken/landen") Landen
          v-list-item(to="/statistieken/talen") Talen
          v-list-item(to="/statistieken/leadvocals") Lead vocals
          v-list-item(to="/statistieken/decennia") Decennia
          v-list-item(to="/statistieken/leeftijden") Leeftijden
        v-list-group(value="/website")
          template(#activator="{ props }")
            v-list-item(v-bind="props") Deze website
          v-list-item(to="/website") Algemene info
          v-list-item(to="/website/geschiedenis") Geschiedenis
          v-list-item(to="/website/methodologie") Methodologie
          v-list-item(to="/website/opendata") Open data
          v-list-item(to="/website/opensource") Open source
          v-list-item(to="/website/privacy") Privacybeleid
          v-list-item(to="/website/contact") Contact
        v-list-group(v-if='isAdmin' value="/admin")
          template(#activator="{ props }")
            v-list-item(v-bind="props")
              v-icon.mr-3(:icon="mdiLockOutline")
              span Admin
          v-list-item(to="/admin/live") Nummers toevoegen
          v-list-item(to="/admin/exits") Exits markeren
          v-list-item(to="/admin/polls") Polls
          v-list-item(to="/admin/analysis") Interessante feiten
          v-list-item(to="/admin/artist") Nieuwe artiest
          v-list-item(to="/admin/users") Gebruikers
          v-list-item(to="/admin/settings") Instellingen

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
  import {mdiLockOutline} from "@mdi/js";

  export default defineNuxtComponent({
    data() {
      return {
        isOpen: false,
        mdiLockOutline: mdiLockOutline,
        selectedPage: undefined
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
        return useRoute().path.split('/').slice(0, 3).join('/');
      },
      openeds() {
        const mainPath = useRoute().path.split('/').slice(0, 2).join('/');
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
          useRouter().push(path);
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
    }
  });
</script>


<style lang="scss" scoped>
  @use "../assets/styleConfig";

  .v-list {
    color: styleConfig.$hoverLinkColor;
    a {
      color: styleConfig.$hoverLinkColor;
    }

    font-size: 16px;
    font-weight: bold;

    .v-list-item:not(:only-child) {
      margin-bottom: unset;
    }

    :deep(.v-list-group__items) {
      font-size: 14px;
      font-weight: normal;

      .v-list-item {
        min-height: unset;
      }
    }

    a.router-link-active {
      color: #409eff;
    }

    span.addition {
      font-size: 12px;
      font-weight: normal;
    }
  }

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
    padding: 1em 1em;
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

</style>