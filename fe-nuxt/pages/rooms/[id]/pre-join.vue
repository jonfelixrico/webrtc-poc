<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDevicesList, useLocalStorage } from '@vueuse/core'
import { definePageMeta, navigateTo, useFetch } from '#imports'
import { useRoomStore } from '~/store/room.store'
import { useRoute, useRouter } from 'vue-router'
import CPreCallUI from '~/components/pre-call/CPreCallUI.vue'
import { useScreen } from '~/composables/tailwind.composable'
import type { Room } from '@webrtcpoc/common'

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

const { t } = useI18n()

const route = useRoute()

const router = useRouter()
const roomStore = useRoomStore()
function joinCall() {
  roomStore.preJoinDone = true
  router.push({
    path: `/rooms/${route.params.id}`,
  })
}

const screen = useScreen()

const userName = useLocalStorage('name', '')

const { data: roomData } = await useFetch<Room>(`/be/room/${route.params.id}`)
</script>

<template>
  <main class="h-dvh w-dvw flex flex-col justify-center items-center">
    <!-- We want to use ClientOnly here to prevent hydration errors where the server renders it as desktop, but the user is using mobile -->
    <ClientOnly>
      <UCard v-if="screen.gt.sm">
        <div class="flex flex-col gap-y-2 w-[50dvw] h-[60dvh]">
          <div v-if="roomData" class="text-center text-2xl">
            <i18n-t keypath="preCall.aboutToJoinRoom">
              <template #roomName>
                <span class="font-bold">
                  {{ roomData?.name }}
                </span>
              </template>
            </i18n-t>
          </div>
          <div class="grow relative">
            <div class="absolute h-full w-full">
              <CPreCallUI
                :audio-devices="audioInputs"
                :video-devices="videoInputs"
                class="h-full w-full"
              />
            </div>
          </div>

          <div class="flex flex-row gap-x-1">
            <UInput
              v-model="userName"
              class="grow"
              :placeholder="t('preCall.namePlaceholder')"
            />
            <UButton @click="joinCall">{{ t('preCall.joinCall') }}</UButton>
          </div>
        </div>
      </UCard>

      <div v-else class="flex flex-col h-dvh w-dvw">
        <CPreCallUI
          :audio-devices="audioInputs"
          :video-devices="videoInputs"
          class="grow"
        />

        <div class="flex flex-row p-1">
          <UInput
            v-model="userName"
            class="grow"
            :placeholder="t('preCall.namePlaceholder')"
          />
          <UButton @click="joinCall">{{ t('preCall.joinCall') }}</UButton>
        </div>
      </div>
    </ClientOnly>
  </main>
</template>
