<template lang="pug">
#container
  div.overlay(v-if="menuOpen")
  #header(@click="mobileSearchOpen = false")
    #header-content
      v-app-bar-nav-icon.burger-button.mobile-header-button(
        variant="text"
        aria-label="Menu"
        @click.stop="mobileSearchOpen = false; menuOpen = !menuOpen"
      )
      #logo(@click="$router.push('/')")
        h1 tijdloze
          span.domain .rocks
        div.subtitle Tijdloze muziek-klassiekers + data-analyse
      search-box.header-search.desktop-search(@selectSearchResult="selectSearchResult($event)")
      v-btn.mobile-search-button.mobile-header-button(
        id="mobile-search-toggle"
        variant="text"
        :icon="mobileSearchOpen ? mdiClose : mdiMagnify"
        :aria-label="mobileSearchOpen ? 'Zoeken sluiten' : 'Zoeken'"
        :aria-expanded="mobileSearchOpen"
        aria-controls="mobile-search-panel"
        @click.stop="mobileSearchOpen = !mobileSearchOpen"
      )
  .mobile-search-panel(
    v-if="mobileSearchOpen"
    id="mobile-search-panel"
    role="search"
    aria-label="Zoeken"
  )
    search-box.mobile-search-box(
      autofocus
      fill-available-height
      menu-attach=".mobile-search-panel"
      @selectSearchResult="selectSearchResult($event)"
    )
  #left
  #sitemenu(:class='{closed: !menuOpen}' :inert="mobileSearchOpen" ref="menuContainer")
    site-menu(@close="menuOpen = false")
  #main(:inert="mobileSearchOpen")
    .hidden
      | tijdloze.rocks bevat statistieken en informatie over de Tijdloze 100. Dit is de allertijden-lijst van Studio Brussel. Op het einde van elk jaar zend StuBru het beste uit de rockgeschiedenis uit. Op deze site vind je alle lijsten sinds 1987 en allerhande statistieken.
    slot
  #right
  snackbar
</template>

<script setup lang="ts">
import { mdiClose, mdiMagnify } from '@mdi/js'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRepo } from 'pinia-orm'
import { apiEndpoints } from '~/api/endpoints'
import useSetUser from '~/composables/useSetUser'
import Song from '~/orm/Song'
import { reloadCoreData } from '~/utils/loadCoreData'

const menuContainer = useTemplateRef('menuContainer')
const menuOpen = ref(false)
const mobileSearchOpen = ref(false)

onClickOutside(menuContainer, () => menuOpen.value = false)

onKeyStroke('Escape', () => {
  if (!mobileSearchOpen.value) return

  mobileSearchOpen.value = false
  nextTick(() => document.getElementById('mobile-search-toggle')?.focus())
})

type SearchResult = {
  type: 'song' | 'artist' | 'album'
  item: {
    id: number
    slug: string
  }
}

function selectSearchResult(result: SearchResult) {
  mobileSearchOpen.value = false

  const paths = {
    song: `/nummer/${result.item.id}-${result.item.slug}`,
    artist: `/artiest/${result.item.id}-${result.item.slug}`,
    album: `/album/${result.item.id}-${result.item.slug}`,
  }

  navigateTo(paths[result.type])
}

onMounted(async () => {
  const auth0 = useAuth0()
  watch(auth0.user, () => useSetUser(auth0), { immediate: true })
  await auth0.checkSession()

  if (useRepo(Song).limit(1).get().length === 0) {
    // workaround until we find the reason why the pinia-orm repos are sometimes empty from SSR
    await reloadCoreData()
  } else {
    const rootStore = useRootStore()
    const coreDataId = (await useNuxtApp().$api(apiEndpoints.coreData.id())).id
    if (coreDataId !== rootStore.coreDataId) {
      await reloadCoreData()
    }
  }
})
</script>

<style>
  @import "../assets/globalStyles.css";
  @import "../assets/styleConfig.css";

  html {
    height: 100%;
  }

  body {
    width: 100%;
    min-width: 480px;
    min-height: 100%;

    #__nuxt {
      height: 100%;
    }
  }

  .router-link-active{
    cursor: auto;
    color: #000;
    &:hover {
      color: #000;
    }
  }

  .v-btn {
    text-transform: unset !important;
    letter-spacing: unset !important;
  }

  p, ul {
    &:not(:last-child) {
      margin-bottom: 0.8em;
    }
  }

  ul {
    margin-left: 2em;
  }

  .burger-button {
    display: none;
  }

  .mobile-header-button {
    width: 48px;
    min-width: 48px;
    height: 48px;
    padding: 0;
  }

  #container {
    display: grid;
    min-width: 480px;
    width: 100%;
    min-height: 100vh;

    grid: 
      "header header header header" 68px
      "left sitemenu main right" 1fr
      / 1fr 300px 900px 2fr;
    
    #header {
      grid-area: header;
      display: grid;
      grid-template-columns: subgrid;
    }

    #header-content {
      grid-column: 2 / 4;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 0;
      padding: 0 50px 0 calc(1.15em + 16px);
      box-sizing: border-box;
    }

    #main {
      grid-area: main;
      justify-self: center;

      padding: 10px 10px 20px 10px;
      width: 100%;
      max-width: 900px;
      box-sizing: border-box;

      @media (min-width: 1200px) {
        width: 900px;
        padding: 10px 50px 20px 50px;
      }
    }

    #sitemenu {
      grid-area: sitemenu;
      background-color: var(--menu-background-color);
      overflow-x: hidden;
    }
    
    #left {
      grid-area: left;
      background-color: var(--menu-background-color);
    }

    #right {
      grid-area: right;
    }


    @media (max-width: 1199px) {
      grid: 
        "header" 68px
        "main" 1fr
        / 1fr;

      #sitemenu {
        grid-area: auto;
        position: fixed;
        z-index: 1002;
        top: 0;
        left: 0;
        bottom: 0;
        width: 300px;
        transition: left 0.2s ease-in-out;

        &.closed {
          left: -300px;
        }
      }

      #header-content {
        grid-column: 1;
        padding: 0 10px;
      }

      #header {
        position: relative;
        z-index: 1001;
      }

      .desktop-search {
        display: none;
      }

      #header .burger-button {
        display: inline-flex;
      }

      #header .mobile-search-button {
        display: inline-flex;
      }
    }
  }

  #header {
    background-color: var(--header-background-color);

    #logo {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      justify-content: center;
      padding-top: 8px;
      height: 68px;
      box-sizing: border-box;
      cursor: pointer;
      text-align: left;

      h1 {
        margin: 0;
        font-size: 32px;
        font-style: italic;

        .domain {
          font-size: 20px;
        }
      }

      .subtitle {
        margin: 0;
        font-size: 12px;
        color: #444;
      }
    }

    .header-search {
      width: var(--search-box-width);
      flex: 0 1 var(--search-box-width);
      min-width: 0;

      .v-field {
        background-color: var(--menu-background-color);
      }
    }

    .mobile-search-button {
      display: none;
    }
  }

  .mobile-search-box {
    width: 100%;
    margin: 0;
    padding: 10px;
    box-sizing: border-box;
    background-color: var(--background-color);

    .v-autocomplete {
      width: 100%;
    }

    .v-field {
      background-color: var(--background-color);
    }
  }

  .mobile-search-panel {
    display: none;
  }

  @media (max-width: 1199px) {
    .mobile-search-panel {
      display: block;
      position: fixed;
      z-index: 1000;
      top: 68px;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: visible;
      background-color: var(--background-color);
    }
  }

  .overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background: rgba(0, 0, 0, 0.3);

    @media (min-width: 1200px) {
      display: none;
    }
  }
</style>
