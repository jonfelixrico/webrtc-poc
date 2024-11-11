<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, definePageMeta, useRoomMembersListener } from '#imports'
import { useWebRtcStore } from '~/store/web-rtc.store'
import CPeerConnectionManager from '~/components/CPeerConnectionManager.vue'
import { useSocketInit } from '~/composables/socket.composable'
import CCallToolbar from '~/components/CCallToolbar.vue'
import {
  useDescriptionHandlers,
  useJoinHandler,
} from '~/composables/rtc-signaling-all.composable'
import CCallRenderer from '~/components/CCallRenderer.vue'

definePageMeta({
  validate: (route) =>
    $fetch(`/be/room/${route.params.id}`)
      // TODO add error-specific handling
      .then(() => true)
      .catch(() => false),
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
}
</script>

<template>
  <main class="h-dvh w-dvw flex flex-col">
    <!-- Renderless section -->
    <ClientOnly>
      <CPeerConnectionManager
        v-for="({ connection }, clientId) in connections"
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
