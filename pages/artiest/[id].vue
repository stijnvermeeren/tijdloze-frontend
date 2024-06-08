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

  ui-card(title="In de Tijdloze")
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

<script>
  import { idFromSlug } from '~/utils/slug'
  import Artist from "@/orm/Artist";
  import {useRootStore} from "~/stores/root";
  import {useRepo} from "pinia-orm";
  import { mdiLink } from '@mdi/js'
  import ExternalLinkBtn from "~/components/ui/ExternalLinkBtn.vue";
  import {create404Error} from "~/composables/create404Error";

  export default defineNuxtComponent({
    components: {ExternalLinkBtn},
    data() {
      return {
        byAlbum: false,
        mdiLinkIcon: mdiLink
      }
    },
    computed: {
      artist() {
        return useRepo(Artist)
          .with('albums', q1 => q1
            .with('songs', q2 => q2
              .with('secondArtist')))
          .with('songs', q1 => q1
            .with('album')
            .with('secondArtist'))
          .with('secondarySongs', q1 => q1
            .with('artist')
            .with('album', q2 => q2
              .with('songs', q3 => q3
                .with('artist'))))
          .find(this.fullArtistData.id);
      },
      top100Songs() {
        return this.artist.allSongs.filter(song => song.listCount(useRootStore().years) > 0)
      },
      currentYear() {
        return useRootStore().currentYear;
      },
      links() {
        const links = [];
        const addLink = (property, title, fn) => {
          if (!fn) {
            fn = x => x
          }

          if (this.fullArtistData[property]) {
            links.push({
              href: fn(this.fullArtistData[property]),
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
      }
    },
    async asyncData() {
      const {data: fullArtistData, error} = await useApiFetch(`artist/${idFromSlug(useRoute().params.id)}`)
      if (error.value) {
        create404Error()
      }
      return {fullArtistData}
    }
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
