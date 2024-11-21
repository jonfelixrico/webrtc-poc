<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDevicesList } from '@vueuse/core'
import { reactive, ref } from 'vue'
import CMediaStreamRendererVideo from '~/components/media-stream/CMediaStreamRendererVideo.vue'
import { useUserMediaStream } from '~/composables/media.composable'
import { definePageMeta, navigateTo } from '#imports'
import { useRoomStore } from '~/store/room.store'
import { useRouter } from 'vue-router'

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

const audioId = ref<string>()
const videoId = ref<string>()

const mediaStream = useUserMediaStream(
  reactive({
    audio: {
      enabled: true,
      id: audioId,
    },
    video: {
      enabled: true,
      id: videoId,
    },
  }),
)

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
    <UCard class="w-[50dvw]">
      <div class="flex flex-row gap-2">
        <div class="grow">
          <CMediaStreamRendererVideo
            v-if="mediaStream"
            class="h-full w-full"
            :media-stream
          />
        </div>

        <div class="flex flex-col justify-between gap-2 w-56">
          <div class="flex flex-col gap-2">
            <div class="flex flex-col">
              <div>{{ t('preCall.video') }}</div>
              <USelect
                v-model="videoId"
                :options="videoInputs"
                value-attribute="deviceId"
              />
            </div>

            <div class="flex flex-col">
              <div>{{ t('preCall.audio') }}</div>
              <USelect
                v-model="audioId"
                :options="audioInputs"
                value-attribute="deviceId"
              />
            </div>
          </div>

          <UButton block @click="joinCall">{{ t('preCall.joinCall') }}</UButton>
        </div>
      </div>
    </UCard>
  </main>
</template>
