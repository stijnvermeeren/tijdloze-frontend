import Vue from 'vue'
import SongLink from '../components/SongLink.vue'
import ArtistLink from '../components/ArtistLink.vue'
import YearLink from '../components/YearLink.vue'

// Filters
Vue.filter('yy', (year) => "'" + (year % 100));
Vue.filter('fullname', (coreArtist) => coreArtist.firstName ? coreArtist.firstName + ' ' + coreArtist.name : coreArtist.name);

// Components
Vue.component("tijdloze-artist", ArtistLink);
Vue.component("tijdloze-song", SongLink);
Vue.component("tijdloze-year", YearLink);
