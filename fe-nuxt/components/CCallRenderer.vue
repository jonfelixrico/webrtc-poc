<script setup lang="ts">
import { computed } from 'vue'
import CCallLayout from '~/components/CCallLayout.vue'
import CMediaStreamRenderer from '~/components/CMediaStreamRenderer.vue'
import CPeerConnectionRendererV2 from '~/components/CPeerConnectionRendererV2.vue'
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
  <CCallLayout v-slot="{ id, width, height }" :ids>
    <template v-if="id === 'self'">
      <CMediaStreamRenderer
        v-if="msStore.mediaStream"
        :media-stream="msStore.mediaStream"
        :width
        :height
      />

      <!-- do nothing for now -->
      <div v-else>No stream</div>
    </template>

    <!-- For peers -->
    <template v-else>
      <CPeerConnectionRendererV2
        v-if="rtcStore.connections[id]"
        :connection="rtcStore.connections[id]"
        class="h-full w-full"
      />

      <!-- TODO handle this -->
      <div v-else>No connection ...</div>
    </template>
  </CCallLayout>
</template>
