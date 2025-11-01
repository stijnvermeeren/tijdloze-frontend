<template lang="pug">
div
  #sideNav(@click.stop='menuClick($event)' ref="menu")
    search-box(@selectSearchResult='selectSearchResult($event)')

    nav
      v-list(bg-color="#fadfbb" density="comfortable" :opened="openeds")
        v-list-item(to="/") Home
        v-list-item(v-if='commentsOn' to="/reacties") Reageer en discussieer
        template(v-if='listInProgress')
          v-list-item(:to="`/lijst/${currentYear.yyyy}`" value="inProgress") De Tijdloze {{currentYear.yyyy}}
          v-list-item.subItem(v-if="chatOn" to="/chat") Chatbox
          v-list-item.subItem(v-if="top100InProgress" to="/polls") Polls
        v-list-group.lists(value="group-/lijst")
          template(#activator="{ props }")
            v-list-item(v-bind="props") De Tijdloze van ...
          v-list-item(v-for='year in sortedYears' :key='year.yyyy' :to='`/lijst/${year.yyyy}`') {{year.yyyy}}
        v-list-item(to="/database") Volledige database
        v-list-group(value="group-/statistieken")
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
        v-list-group(value="group-/website")
          template(#activator="{ props }")
            v-list-item(v-bind="props") Deze website
          v-list-item(to="/website") Algemene info
          v-list-item(to="/website/geschiedenis") Geschiedenis
          v-list-item(to="/website/methodologie") Methodologie
          v-list-item(to="/website/opendata") Open data
          v-list-item(to="/website/opensource") Open source
          v-list-item(to="/website/privacy") Privacybeleid
          v-list-item(to="/website/contact") Contact
        v-list-group(v-if='isAdmin' value="group-/admin")
          template(#activator="{ props }")
            v-list-item(v-bind="props")
              v-icon.mr-3(:icon="mdiLockOutline")
              span Admin
          v-list-item(to="/admin/live") Nummers toevoegen
          v-list-item(to="/admin/exits") Exits markeren
          v-list-item(to="/admin/polls") Polls
          v-list-item(to="/admin/analysis") Interessante feiten
          v-list-item(to="/admin/artist") Nieuwe artiest
          v-list-item(to="/admin/album") Nieuw album
          v-list-item(to="/admin/crawl") Crawler
          v-list-item(to="/admin/users") Gebruikers
          v-list-item(to="/admin/settings") Instellingen

    login

    div.kofi
      v-btn(rounded href='https://ko-fi.com/tijdloze_rocks' size="small" color="brown" variant="tonal")
        img(src="https://storage.ko-fi.com/cdn/cup-border.png" alt="Ko-fi donations" class="kofiimg")
        | Steun ons op Ko-fi

    v-btn.cross-button(@click='close' circle size="small" variant="text" :icon="mdiClose")

</template>

<script setup>
import {useRootStore} from "~/stores/root";
import {useAuthStore} from "~/stores/auth";
import {mdiLockOutline, mdiClose} from "@mdi/js";

const emit = defineEmits(["close"])

const openeds = computed(() => {
  return [groupMap(useRoute().path)]
})
const { commentsOn, chatOn } = storeToRefs(useConfigStore())
const { lastPosition, listInProgress } = storeToRefs(useRootStore())
const { currentYear, years } = storeToRefs(useYearStore())
const { isAdmin } = storeToRefs(useAuthStore())

const top100InProgress = computed(() => {
  return listInProgress.value && lastPosition.value <= 100;
})
const sortedYears = computed(() => {
  return [...years.value].reverse();
})

function groupMap(path) {
  const firstPart = path.split('/').slice(0, 2).join('/')
  switch (path) {
    case '/polls':
    case '/chat':
      return 'inprogress'
    default:
      return `group-${firstPart}`
  }
}
function selectSearchResult(result) {
  let path = ''

  if (result.type === 'song') {
    path = `/nummer/${result.item.id}-${result.item.slug}`
  } else if (result.type === 'artist') {
    path = `/artiest/${result.item.id}-${result.item.slug}`
  } else if (result.type === 'album') {
    path = `/album/${result.item.id}-${result.item.slug}`
  }
  if (path) {
    close();
    navigateTo(path);
  }
}

const menu = useTemplateRef('menu')

onClickOutside(menu, close)
onKeyStroke('Escape', close)

function close(e) {
  emit('close');
}
function menuClick(event) {
  if (event.target.parentElement?.tagName?.toLowerCase() === 'a') {
    close();
  }
}
</script>


<style lang="scss" scoped>
  @use "../assets/styleConfig";

  .kofi {
    margin-top: 30px;
    text-align: center;
    img.kofiimg {
      width: 24px;
      margin-right: 5px;
    }
  }

  .v-list {
    font-size: 16px;
    font-weight: bold;
    color: styleConfig.$hoverLinkColor;

    a {
      color: styleConfig.$hoverLinkColor;
    }

    .v-list-item:not(:only-child) {
      margin-bottom: unset;
    }

    :deep(.v-list-group__items) .v-list-item, .v-list-item.subItem {
      padding-inline-start: 32px !important;
      font-size: 14px;
      font-weight: normal;
      padding: 4px 16px;
      min-height: unset;
    }

    .lists :deep(.v-list-group__items) {
      padding: 0 16px;

      .v-list-item {
        display: inline-block;
        padding-inline-start: 0 !important;
        padding-inline-end: 0 !important;
        padding: 4px 8px !important;
        margin-right: 5px;
        .v-list-item__content {
          min-width: unset !important;
        }
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
    padding: 1em 1em;
    transition: 0.3s;

    font-size: 115%;

    @media (max-width: 1199px) {
      padding-top: 50px;
    }
  }

  .cross-button {
    text-align: center;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;

    @media (min-width: 1200px) {
      display: none;
    }
  }

</style>