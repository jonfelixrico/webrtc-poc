<script setup lang="ts">
import { computed } from 'vue'
import CCallLayout from '~/components/CCallLayout.vue'
import CCallParticipantRendererPeer from '~/components/CCallParticipantRendererPeer.vue'
import { useMediaStreamStore } from '~/store/media-stream.store'
import CCallParticipantRendererSelf from '~/components/CCallParticipantRendererSelf.vue'
import { useRoomStore } from '~/store/room.store'
import { useWebRtcStore } from '~/store/web-rtc.store'
import { useUserId } from '~/composables/room-composables'
import CCallAudioRenderer from '~/components/audio/CCallAudioRenderer.vue'

const roomStore = useRoomStore()

const selfId = useUserId()
const ids = computed(() => {
  const ids: string[] = ['self']

  for (const id in roomStore.users) {
    // User is already identified as the first item 'self'
    if (selfId.value === id) {
      continue
    }

    ids.push(id)
  }

  return ids
})

const msStore = useMediaStreamStore()
const rtcStore = useWebRtcStore()
</script>

<template>
  <CCallLayout v-slot="{ id }" v-bind="$attrs" :ids>
    <template v-if="id === 'self'">
      <!-- TODO provide proper name -->
      <CCallParticipantRendererSelf
        class="h-full w-full"
        display-name="Self"
        :media-stream="msStore.mediaStream"
      />
    </template>

    <!-- For peers -->
    <template v-else>
      <!-- TODO provide proper name -->
      <CCallParticipantRendererPeer
        :connection="rtcStore.connections.get(id)"
        class="h-full w-full"
        :display-name="id"
      />
    </template>
  </CCallLayout>

  <CCallAudioRenderer />
</template>
