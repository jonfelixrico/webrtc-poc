<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  computed,
  definePageMeta,
  navigateTo,
  useRoomMembersListener,
} from '#imports'
import { useWebRtcStore } from '~/store/web-rtc.store'
import CPeerConnectionManager from '~/components/CPeerConnectionManager.vue'
import { useSocketInit } from '~/composables/socket.composable'
import CCallToolbar from '~/components/call/CCallToolbar.vue'
import {
  useDescriptionHandlers,
  useJoinHandler,
} from '~/composables/rtc-signaling-all.composable'
import CCallRenderer from '~/components/CCallRenderer.vue'
import { useRoomStore } from '~/store/room.store'
import { provideUserDevices } from '~/composables/media.composable'

definePageMeta({
  middleware: [
    'room-exists-check',
    /**
     * Redirects the user back to the pre-join page if we detected that
     * they have not visited that page prior to going here.
     */
    (to) => {
      const roomStore = useRoomStore()
      if (roomStore.preJoinDone) {
        return
      }

      return navigateTo(`/rooms/${to.params.id}/pre-join`)
    },
  ],
})

const route = useRoute()

const connStore = useWebRtcStore()
const connections = computed(() => connStore.connections)

if (import.meta.client) {
  const roomId = String(route.params.id)

  useSocketInit(roomId)
  useJoinHandler()
  useDescriptionHandlers()
  useRoomMembersListener()
  provideUserDevices()
}
</script>

<template>
  <main class="h-dvh w-dvw flex flex-col">
    <!-- Renderless section -->
    <ClientOnly>
      <CPeerConnectionManager
        v-for="[clientId, { connection }] in connections"
        :key="clientId"
        :peer-client-id="clientId"
        :peer-connection="connection"
      />
    </ClientOnly>

    <div class="grow overflow-auto">
      <CCallRenderer />
    </div>

    <ClientOnly>
      <CCallToolbar />
    </ClientOnly>
  </main>
</template>
