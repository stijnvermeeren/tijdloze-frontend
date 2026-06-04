import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const commentsOn = ref(true)
  const chatOn = ref(false)
    
  return {
    chatOn,
    commentsOn
  }
})
