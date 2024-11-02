<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, definePageMeta } from '#imports'
import CMediaStreamRenderer from '~/components/CMediaStreamRenderer.vue'
import { useMediaStreamStore } from '~/store/media-stream.store'
import { useWebRtcStore } from '~/store/web-rtc.store'
import { useJoinHandler } from '~/composables/rtc-signaling-join.composable'
import CPeerConnectionManager from '~/components/CPeerConnectionManager.vue'
import { useSocketInit } from '~/composables/socket.composable'
import { useDescriptionHandlers } from '~/composables/rtc-signaling-description.composable'
import CPeerConnectionRenderer from '~/components/CPeerConnectionRenderer.vue'
import CCallToolbar from '~/components/CCallToolbar.vue'

definePageMeta({
  validate: (route) =>
    $fetch(`/be/room/${route.params.id}`)
      // TODO add error-specific handling
      .then(() => true)
      .catch(() => false),
})

const route = useRoute()

const mediaStreamStore = useMediaStreamStore()
const connStore = useWebRtcStore()
const connections = computed(() => connStore.connections)

if (import.meta.client) {
  useSocketInit()
  useJoinHandler(String(route.params.id))
  useDescriptionHandlers()
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

    <div class="grow flex flex-row overflow-auto">
      <div class="flex-1">
        <ClientOnly>
          <CMediaStreamRenderer
            v-if="mediaStreamStore.mediaStream"
            :media-stream="mediaStreamStore.mediaStream"
            :width="400"
            :height="400"
          />
        </ClientOnly>
      </div>

      <div class="flex-1 flex flex-col">
        <CPeerConnectionRenderer
          v-for="(connection, clientId) in connections"
          :key="clientId"
          :connection
        />
      </div>
    </div>

    <ClientOnly>
      <CCallToolbar />
    </ClientOnly>
  </main>
</template>
