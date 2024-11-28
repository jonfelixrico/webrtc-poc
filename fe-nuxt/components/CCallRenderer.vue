<script setup lang="ts">
import { computed } from 'vue'
import CCallLayout from '~/components/CCallLayout.vue'
import CCallParticipantRendererPeer from '~/components/CCallParticipantRendererPeer.vue'
import { useMediaStreamStore } from '~/store/media-stream.store'
import CCallParticipantRendererSelf from '~/components/CCallParticipantRendererSelf.vue'
import { useRoomStore } from '~/store/room.store'
import { useWebRtcStore } from '~/store/web-rtc.store'
import { useUserId } from '~/composables/room-composables'
import CCallAudioRenderer from '~/components/CCallAudioRenderer.vue'

const roomStore = useRoomStore()

const selfId = useUserId()
const ids = computed(() => Object.keys(roomStore.users).sort())

const msStore = useMediaStreamStore()
const rtcStore = useWebRtcStore()
</script>

<template>
  <!-- v-if is a quick-fix for now to avoid ...RendererSelf from throwing -->
  <CCallLayout v-if="selfId" v-slot="{ id }" v-bind="$attrs" :ids>
    <CCallParticipantRendererSelf
      v-if="id === selfId"
      class="h-full w-full"
      :media-stream="msStore.mediaStream"
      :user="roomStore.users[id]"
    />

    <!-- For peers -->
    <CCallParticipantRendererPeer
      v-else
      :connection="rtcStore.connections.get(id)"
      class="h-full w-full"
      :user="roomStore.users[id]"
    />
  </CCallLayout>

  <CCallAudioRenderer />
</template>
