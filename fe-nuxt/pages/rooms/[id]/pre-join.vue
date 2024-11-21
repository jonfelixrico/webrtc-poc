<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDevicesList } from '@vueuse/core'
import { reactive } from 'vue'
import { definePageMeta, navigateTo } from '#imports'
import { useRoomStore } from '~/store/room.store'
import { useRouter } from 'vue-router'
import type { DeviceState } from '~/typings/media.types'
import CPrejoinInput from '~/components/pre-join/CPrejoinInput.vue'

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

const audio = reactive<DeviceState>({
  id: null,
  enabled: false,
})
const video = reactive<DeviceState>({
  id: null,
  enabled: false,
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
      <div class="flex flex-col">
        <CPrejoinInput
          v-model:audio="audio"
          v-model:video="video"
          :audio-devices="audioInputs"
          :video-devices="videoInputs"
          class="w-[50dvw] h-[30dvh]"
        />

        <UButton block @click="joinCall">{{ t('preCall.joinCall') }}</UButton>
      </div>
    </UCard>
  </main>
</template>
