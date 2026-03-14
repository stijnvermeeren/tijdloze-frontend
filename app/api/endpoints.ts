import { albumEndpoints } from './endpoints/album'
import { artistEndpoints } from './endpoints/artist'
import { cacheEndpoints } from './endpoints/cache'
import { chatEndpoints } from './endpoints/chat'
import { commentEndpoints } from './endpoints/comment'
import { contactEndpoints } from './endpoints/contact'
import { coreDataEndpoints } from './endpoints/core-data'
import { crawlProcessEndpoints } from './endpoints/crawl-process'
import { listEntryEndpoints } from './endpoints/list-entry'
import { listExitEndpoints } from './endpoints/list-exit'
import { mbdataEndpoints } from './endpoints/mbdata'
import { musicbrainzEndpoints } from './endpoints/musicbrainz'
import { pollEndpoints } from './endpoints/poll'
import { songEndpoints } from './endpoints/song'
import { spotifyEndpoints } from './endpoints/spotify'
import { textEndpoints } from './endpoints/text'
import { userEndpoints } from './endpoints/user'
import { wikipediaEndpoints } from './endpoints/wikipedia'
import { wikidataEndpoints } from './endpoints/wikidata'
import { yearEndpoints } from './endpoints/year'

export type { ApiEndpoint, ApiMethod, MutationMethod, ReadOnlyMethod } from './endpoints/shared'

export const apiEndpoints = {
  coreData: coreDataEndpoints,
  text: textEndpoints,
  user: userEndpoints,
  chat: chatEndpoints,
  poll: pollEndpoints,
  artist: artistEndpoints,
  album: albumEndpoints,
  song: songEndpoints,
  spotify: spotifyEndpoints,
  mbdata: mbdataEndpoints,
  musicbrainz: musicbrainzEndpoints,
  wikipedia: wikipediaEndpoints,
  wikidata: wikidataEndpoints,
  crawlProcess: crawlProcessEndpoints,
  year: yearEndpoints,
  listEntry: listEntryEndpoints,
  listExit: listExitEndpoints,
  comment: commentEndpoints,
  cache: cacheEndpoints,
  contact: contactEndpoints,
} as const
