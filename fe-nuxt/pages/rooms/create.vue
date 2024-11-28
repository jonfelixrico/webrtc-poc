<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDevicesList, useLocalStorage } from '@vueuse/core'
import { useRoomStore } from '~/store/room.store'
import { useRouter } from 'vue-router'
import CPreCallUI from '~/components/pre-call/CPreCallUI.vue'
import { useScreen } from '~/composables/tailwind.composable'
import type { Room } from '@webrtcpoc/common'
import { ref } from 'vue'
import CPreCallRoomName from '~/components/pre-call/CPreCallRoomName.vue'
import { useFetch } from '#app'

const { audioInputs, videoInputs } = useDevicesList({
  constraints: {
    audio: true,
    video: true,
  },
  requestPermissions: true,
})

const { t } = useI18n()

const screen = useScreen()

const userName = useLocalStorage('name', '')

const { data } = useFetch<{ name: string }>('/be/room/name')
const roomName = ref<string>(data.value?.name ?? '')

const router = useRouter()
const roomStore = useRoomStore()
async function createRoom() {
  const { id } = await $fetch<Room>('/be/room', {
    method: 'POST',
    body: {
      name: roomName.value,
    },
  })
  roomStore.preJoinDone = true
  await router.push({
    path: `/rooms/${id}`,
  })
}
</script>

<template>
  <main class="h-dvh w-dvw flex flex-col justify-center items-center">
    <!-- We want to use ClientOnly here to prevent hydration errors where the server renders it as desktop, but the user is using mobile -->
    <ClientOnly>
      <UCard v-if="screen.gt.sm">
        <div class="flex flex-col gap-y-2 w-[50dvw] h-[60dvh]">
          <CPreCallRoomName v-model="roomName" />

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
              :placeholder="t('preCall.namePlaceholder')"
              class="grow"
            />
            <UButton @click="createRoom">{{ t('preCall.createRoom') }}</UButton>
          </div>
        </div>
      </UCard>

      <div v-else class="flex flex-col w-dvw h-dvh">
        <CPreCallRoomName v-model="roomName" class="p-2" />

        <div class="grow relative">
          <div class="absolute h-full w-full">
            <CPreCallUI
              :audio-devices="audioInputs"
              :video-devices="videoInputs"
              class="h-full w-full"
            />
          </div>
        </div>

        <div class="flex flex-row gap-x-1 p-">
          <UInput
            v-model="userName"
            :placeholder="t('preCall.namePlaceholder')"
            class="grow"
          />
          <UButton @click="createRoom">{{ t('preCall.createRoom') }}</UButton>
        </div>
      </div>
    </ClientOnly>
  </main>
</template>
