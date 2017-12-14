import Vue from 'vue'
import SongLink from '../components/SongLink.vue'
import ArtistLink from '../components/ArtistLink.vue'
import CountryIcon from '../components/CountryIcon.vue'
import YearLink from '../components/YearLink.vue'

import Tabs from '../components/Tabs.vue'

import Position from '../components/Position.vue'
import PositionChange from '../components/PositionChange.vue'

// Components
Vue.component("tijdloze-artist", ArtistLink);
Vue.component("tijdloze-country-icon", CountryIcon);
Vue.component("tijdloze-song", SongLink);
Vue.component("tijdloze-year", YearLink);
Vue.component("tijdloze-tabs", Tabs);
Vue.component("tijdloze-position", Position);
Vue.component("tijdloze-position-change", PositionChange);
