<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDevicesList } from '@vueuse/core'
import { computed } from 'vue'
import { definePageMeta, navigateTo } from '#imports'
import { useRoomStore } from '~/store/room.store'
import { useRouter } from 'vue-router'
import CPrejoinInput from '~/components/pre-join/CPrejoinInput.vue'
import { usePersistedDeviceConfig } from '~/composables/media.composable'

definePageMeta({
  middleware: [
    'room-exists-check',
    /**
     * Navigates the user to the actual call if we've detected that they've
     * gone through here before.
     *
     * Expected scenario is if the user hits the back button from the actual
     * call page.
     */
    (to) => {
      if (import.meta.client) {
        const roomStore = useRoomStore()

        if (roomStore.preJoinDone) {
          return navigateTo(`/rooms/${to.params.id}`)
        }
      }
    },
  ],
})

const { audioInputs, videoInputs } = useDevicesList({
  constraints: {
    audio: true,
    video: true,
  },
  requestPermissions: true,
})

const state = usePersistedDeviceConfig({
  audio: audioInputs,
  video: videoInputs,
})
const audio = computed({
  get: () => state.audio,
  set: ({ enabled, id }) => {
    // cant reassign state.audio; it breaks the linked refs within usePersistentDeviceConfig
    state.audio.id = id
    state.audio.enabled = enabled
  },
})
const video = computed({
  get: () => state.video,
  set: ({ enabled, id }) => {
    state.video.enabled = enabled
    state.video.id = id
  },
})

const { t } = useI18n()

const router = useRouter()
const roomStore = useRoomStore()
function joinCall() {
  roomStore.preJoinDone = true
  router.push({
    path: `/rooms/${router.currentRoute.value.params.id}`,
  })
}
</script>

<template>
  <main class="h-dvh w-dvw flex flex-col justify-center items-center">
    <UCard>
      <div class="flex flex-col gap-y-2">
        <CPrejoinInput
          v-model:audio="audio"
          v-model:video="video"
          :audio-devices="audioInputs"
          :video-devices="videoInputs"
          class="w-[50dvw] h-[60dvh]"
        />

        <UButton block @click="joinCall">{{ t('preCall.joinCall') }}</UButton>
      </div>
    </UCard>
  </main>
</template>
