<template lang="pug">
Title {{artist.fullName}}
div
  div.flexTitle
    page-title(icon='artist' icon-alt='Artiest')
      h2 {{artist.fullName}}
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
      v-btn-toggle(v-model="tab" density="compact" color="blue" variant="outlined")
        v-btn(value='tijdloze') Tijdloze {{currentYear.yyyy}}
        v-btn(value='album') Per album
    div(v-if="tab === 'tijdloze'")
      in-current-list(:songs='artist.allSongs' :artist='artist')
    div(v-if="tab === 'album'")
      ul(v-if='artist.allAlbums')
        li(v-for='album in artist.allAlbums')
          album-link(:album='album')
          |  ({{album.releaseYear}})
          ul(v-if='album.songsSorted.length')
            template(v-for='song in album.songsSorted' key='song.id')
              li(v-if="song.artistId === artist.id || song.secondArtistId === artist.id")
                song-with-second-artist-link(:song='song' :artist="artist")

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
        tab: 'tijdloze',
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
        const addLink = (property, title) => {
          if (this.fullArtistData[property]) {
            links.push({
              href: this.fullArtistData[property],
              title: title
            })
          }
        };

        addLink('urlOfficial', 'Officiële website');
        addLink('urlWikiEn', 'Wikipedia (Engels)');
        addLink('urlWikiNl', 'Wikipedia (Nederlands)');
        addLink('urlAllMusic', 'AllMusic');
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
