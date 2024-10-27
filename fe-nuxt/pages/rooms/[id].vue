<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSocket } from '~/composables/socket.composable'
import {
  useRtcJoinHandler,
  useRtcOfferListener,
} from '~/composables/rtc-signaling.composable'
import { computed, definePageMeta } from '#imports'

definePageMeta({
  validate: (route) =>
    $fetch(`/be/room/${route.params.id}`)
      // TODO add error-specific handling
      .then(() => true)
      .catch(() => false),
})
const route = useRoute()

if (import.meta.client) {
  const appSocket = useSocket()
  useRtcJoinHandler(
    appSocket,
    computed(() => String(route.params.id)),
  )
  useRtcOfferListener(appSocket)
}
</script>

<template>
  <div>
    {{ route.params.id }}
  </div>
</template>
