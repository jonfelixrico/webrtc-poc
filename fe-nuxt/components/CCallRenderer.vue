<script setup lang="ts">
import { computed } from 'vue'
import CCallLayout from '~/components/CCallLayout.vue'
import CMediaStreamRenderer from '~/components/CMediaStreamRenderer.vue'
import CCallParticipantRendererPeer from '~/components/CCallParticipantRendererPeer.vue'
import { useMediaStreamStore } from '~/store/media-stream.store'
import { useWebRtcStore } from '~/store/web-rtc.store'

const store = useWebRtcStore()
const ids = computed(() => {
  return [...Object.keys(store.connections), 'self']
})

const rtcStore = useWebRtcStore()
const msStore = useMediaStreamStore()
</script>

<template>
  <CCallLayout v-slot="{ id }" :ids>
    <template v-if="id === 'self'">
      <CMediaStreamRenderer
        v-if="msStore.mediaStream"
        :media-stream="msStore.mediaStream"
        class="h-full w-full"
      />

      <!-- do nothing for now -->
      <div v-else>No stream</div>
    </template>

    <!-- For peers -->
    <template v-else>
      <CCallParticipantRendererPeer
        :connection="rtcStore.connections[id]"
        class="h-full w-full"
        :display-name="id"
      />
    </template>
  </CCallLayout>
</template>
