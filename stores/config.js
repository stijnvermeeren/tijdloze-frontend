import { defineStore } from 'pinia'
import { useRepo } from 'pinia-orm'
import _ from 'lodash';

import Artist from '~/orm/Artist';
import Song from '~/orm/Song';
import Year from '~/orm/Year';
import List from '~/orm/List';

export const useConfigStore = defineStore('config', () => {
  const commentsOn = ref(true)
  const chatOn = ref(false)
    
  return {
    chatOn,
    commentsOn
  }
})
