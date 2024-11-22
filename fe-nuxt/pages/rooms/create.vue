<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDevicesList } from '@vueuse/core'
import { useRoomStore } from '~/store/room.store'
import { useRouter } from 'vue-router'
import CPreCallUI from '~/components/pre-join/CPreCallUI.vue'
import { useScreen } from '~/composables/tailwind.composable'

const { audioInputs, videoInputs } = useDevicesList({
  constraints: {
    audio: true,
    video: true,
  },
  requestPermissions: true,
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
              <CPreCallUI
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

      <CPreCallUI
        v-else
        :audio-devices="audioInputs"
        :video-devices="videoInputs"
        class="h-dvh w-dvw"
      >
        <UButton block @click="createRoom">{{
          t('preCall.createRoom')
        }}</UButton>
      </CPreCallUI>
    </ClientOnly>
  </main>
</template>
