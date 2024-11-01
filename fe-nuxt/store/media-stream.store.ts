import { defineStore } from 'pinia'

export interface MediaStreamStore {
  mediaStream: MediaStream | null
}

export const useMediaStreamStore = defineStore('mediaStream', {
  state: () =>
    ({
      mediaStream: null,
    }) as MediaStreamStore,
})
