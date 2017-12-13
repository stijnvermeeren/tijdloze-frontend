import Vue from 'vue'
import SongLink from '../components/SongLink.vue'
import ArtistLink from '../components/ArtistLink.vue'
import CountryIcon from '../components/CountryIcon.vue'
import YearLink from '../components/YearLink.vue'
import Tabs from '../components/Tabs.vue'

// Filters
Vue.filter('yy', year => "'" + ('' + year).substring(2, 4));
Vue.filter('fullname', coreArtist => coreArtist.firstName ? coreArtist.firstName + ' ' + coreArtist.name : coreArtist.name);

// Components
Vue.component("tijdloze-artist", ArtistLink);
Vue.component("tijdloze-country-icon", CountryIcon);
Vue.component("tijdloze-song", SongLink);
Vue.component("tijdloze-year", YearLink);
Vue.component("tijdloze-tabs", Tabs);
