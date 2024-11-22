<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDevicesList } from '@vueuse/core'
import { computed } from 'vue'
import { useRoomStore } from '~/store/room.store'
import { useRouter } from 'vue-router'
import CPrejoinInput from '~/components/pre-join/CPrejoinInput.vue'
import { usePersistedDeviceConfig } from '~/composables/media.composable'
import { useScreen } from '~/composables/tailwind.composable'

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
async function createRoom() {
  const { roomId } = await $fetch<{ roomId: string }>('/be/room', {
    method: 'POST',
  })
  roomStore.preJoinDone = true
  await router.push({
    path: `/rooms/${roomId}`,
  })
}

const screen = useScreen()
</script>

<template>
  <main class="h-dvh w-dvw flex flex-col justify-center items-center">
    <!-- We want to use ClientOnly here to prevent hydration errors where the server renders it as desktop, but the user is using mobile -->
    <ClientOnly>
      <UCard v-if="screen.gt.sm">
        <div class="flex flex-col gap-y-2 w-[50dvw] h-[60dvh]">
          <div class="grow relative">
            <div class="absolute h-full w-full">
              <CPrejoinInput
                v-model:audio="audio"
                v-model:video="video"
                :audio-devices="audioInputs"
                :video-devices="videoInputs"
                class="h-full w-full"
              />
            </div>
          </div>
          <UButton block @click="createRoom">{{
            t('preCall.createRoom')
          }}</UButton>
        </div>
      </UCard>

      <CPrejoinInput
        v-else
        v-model:audio="audio"
        v-model:video="video"
        :audio-devices="audioInputs"
        :video-devices="videoInputs"
        class="h-dvh w-dvw"
      >
        <UButton block @click="createRoom">{{
          t('preCall.createRoom')
        }}</UButton>
      </CPrejoinInput>
    </ClientOnly>
  </main>
</template>
