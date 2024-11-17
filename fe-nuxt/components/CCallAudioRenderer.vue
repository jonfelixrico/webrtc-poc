<script setup lang="ts">
import { computed } from 'vue'
import CAudioRenderer from '~/components/media/CAudioRenderer.vue'
import { useUserId } from '~/composables/room-composables'
import { useRoomStore } from '~/store/room.store'
import { useWebRtcStore } from '~/store/web-rtc.store'

const roomStore = useRoomStore()
const rtcStore = useWebRtcStore()

const selfId = useUserId()
const streams = computed(() => {
  const value: Record<string, MediaStream> = {}

  for (const userId in roomStore.users) {
    if (userId === selfId.value) {
      continue
    }

    const stream = rtcStore.connections.get(userId)?.stream
    if (!stream) {
      continue
    }

    value[userId] = stream
  }

  return value
})
</script>

<template>
  <div class="absolute hidden">
    <CAudioRenderer
      v-for="(stream, id) in streams"
      :key="`${id}-${stream.id}`"
      :media-stream="stream"
    />
  </div>
</template>
