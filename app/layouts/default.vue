<template lang="pug">
#container
  v-app-bar-nav-icon.burger-button(variant="text" @click.stop="menuOpen = !menuOpen")
  div.overlay(v-if="menuOpen")
  #header
    #logo(@click="$router.push('/')")
      h1 tijdloze
        span.domain .rocks
      div.subtitle Tijdloze muziek-klassiekers + data-analyse
  #left
  #sitemenu(:class='{closed: !menuOpen}' ref="menuContainer")
    site-menu(@close="menuOpen = false")
  #main
    .hidden
      | tijdloze.rocks bevat statistieken en informatie over de Tijdloze 100. Dit is de allertijden-lijst van Studio Brussel. Op het einde van elk jaar zend StuBru het beste uit de rockgeschiedenis uit. Op deze site vind je alle lijsten sinds 1987 en allerhande statistieken.
    slot
  #right
  snackbar
</template>

<script setup>
import useSetUser from "~/composables/useSetUser";
import {useAuth0} from "@auth0/auth0-vue";
import { reloadCoreData } from "~/utils/loadCoreData";
import { useRepo } from "pinia-orm";
import Song from "~/orm/Song";

const menuContainer = useTemplateRef('menuContainer')
const menuOpen = ref(false)

onClickOutside(menuContainer, () => menuOpen.value = false)

onMounted(async () => {
  const auth0 = useAuth0()
  watch(auth0.user, () => useSetUser(auth0), { immediate: true })
  await auth0.checkSession()

  if (useRepo(Song).limit(1).get().length === 0) {
    // workaround until we find the reason why the pinia-orm repos are sometimes empty from SSR
    await reloadCoreData()
  } else {
    const nuxtApp = useNuxtApp()
    const rootStore = useRootStore()
    const coreDataResponse = await nuxtApp.$api('core-data/id')
    if (coreDataResponse?.id !== rootStore.coreDataId) {
      await reloadCoreData()
    }
  }
  const nuxtApp = useNuxtApp()
  const rootStore = useRootStore()
  const coreDataResponse = await nuxtApp.$api('core-data/id')
  if (coreDataResponse?.id !== rootStore.coreDataId) {
    await reloadCoreData()
  }
})
</script>

<style lang="scss">
  @use "../assets/globalStyles";
  @use "../assets/styleConfig";

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
    position: absolute;
    left: 26px;
    top: 10px;

    @media (min-width: 1200px) {
      display: none;
    }
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
      background-color: styleConfig.$menuBackgroundColor;
      overflow-x: hidden;
    }
    
    #left {
      grid-area: left;
      background-color: styleConfig.$menuBackgroundColor;
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
        z-index: 1000;
        top: 0;
        left: 0;
        bottom: 0;
        width: 300px;
        transition: left 0.2s ease-in-out;

        &.closed {
          left: -300px;
        }
      }
    }
  }

  #header {
    flex: 0 1 auto;
    background-color: styleConfig.$headerBackgroundColor;

    #logo {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-top: 8px;
      height: 68px;
      cursor: pointer;
      text-align: center;

      h1 {
        margin: 0 20px;
        font-size: 32px;
        font-style: italic;

        .domain {
          font-size: 20px;
        }
      }

      .subtitle {
        margin: 0 20px;
        font-size: 12px;
        color: #444;
      }
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
