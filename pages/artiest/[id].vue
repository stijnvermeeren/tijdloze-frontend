<template lang="pug">
Title {{artist.name}}
div
  div.flexTitle
    page-title(icon='artist' icon-alt='Artiest')
      h2 {{artist.name}}
    ui-admin-link-btn(:to="`/admin/artist/${artist.id}`") Admin: artist aanpassen

  div.links
    nuxt-link(:to='`/database?type=artiesten&land=${artist.countryId}`')
      v-btn(size="small" density="comfortable" rounded)
        country-icon(:country-id='artist.countryId' :include-name="true")
    external-link-btn(v-for='(link, index) in links' :key='index' :href="link.href") {{ link.title }}

  ui-alert(v-if='fullArtistData.notes')
    make-links(:text='fullArtistData.notes')

  ui-card(
    :title="`In de Tijdloze van ${currentYear.yyyy}`"
    :collapse-height="collapseHeight"
    :collapse-message="`Toon alle ${artist.allSongs.length} nummers`"
  )
    template(#subtitle)
      entry-count(:songs='artist.allSongs')
    template(#buttons)
      v-checkbox(v-model="byAlbum" density="compact" color="blue" variant="outlined" label="Per album")
    div(v-if="!byAlbum")
      in-current-list(:songs='artist.allSongs' :artist='artist')
    div(v-else)
      in-current-list(:albums='artist.allAlbums' :artist='artist')

  ui-card(v-if='top100Songs.length' title="Grafiek")
    d3-graph(:songs='top100Songs')
</template>

<script setup>
  import { idFromSlug } from '~/utils/slug'
  import Artist from "@/orm/Artist";
  import {useRootStore} from "~/stores/root";
  import {useRepo} from "pinia-orm";
  import ExternalLinkBtn from "~/components/ui/ExternalLinkBtn.vue";

  const byAlbum = ref(false)

  const artistId = computed(() => idFromSlug(useRoute().params?.id))

  // TODO: https://github.com/nuxt/nuxt/issues/20664#issuecomment-2453845270
  const {data: fullArtistData, error} = await useFetch(
      `artist/${artistId.value}`, useFetchOpts({key: `artist/${artistId.value}`})
  )

  if (error.value) {
    create404Error()
  }

  const artist = computed(() => {
    return useRepo(Artist)
        .with('albums', q1 => q1
            .with('songs', q2 => q2
                .with('secondArtist').with('artist').with('album')))
        .with('songs', q1 => q1
            .with('album')
            .with('artist')
            .with('secondArtist'))
        .with('secondarySongs', q1 => q1
            .with('artist')
            .with('secondArtist')
            .with('album', q2 => q2
                .with('songs', q3 => q3
                    .with('artist').with('secondArtist').with('album'))))
        .find(artistId.value);
  })

  const currentYear = computed(() => {
    return useRootStore().currentYear;
  })

  const collapseHeight = computed(() => {
    if (artist.value.allSongs.length <= 5) {
      return undefined
    } else {
      const probablyInTop100Songs = artist.value.allSongs.filter(song => song.probablyInList(currentYear.value))
      return 60 + 70 * Math.max(4, probablyInTop100Songs.length)
    }
  })

  const top100Songs = computed(() => {
    return artist.value.allSongs.filter(song => song.listCount(useRootStore().years) > 0)
  })

  const links = computed(() => {
    const links = [];
    const addLink = (property, title, fn) => {
      if (!fn) {
        fn = x => x
      }

      if (fullArtistData.value[property]) {
        links.push({
          href: fn(fullArtistData.value[property]),
          title: title
        })
      }
    };

    addLink('urlOfficial', 'Officiële website');
    addLink('urlWikiEn', 'Wikipedia (Engels)');
    addLink('urlWikiNl', 'Wikipedia (Nederlands)');
    addLink('urlAllMusic', 'AllMusic');
    addLink('spotifyId', 'Spotify', id => `https://open.spotify.com/artist/${id}`);
    return links;
  })
</script>

<style lang="scss" scoped>
.links {
  margin-top: 10px;
  margin-bottom: 20px;

  a {
    margin: 0 5px;
  }
}
</style>
