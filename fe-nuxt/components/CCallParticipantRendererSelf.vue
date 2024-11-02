<script setup lang="ts">
import { computed, type PropType } from 'vue'
import CCallParticipantLayout from '~/components/CCallParticipantLayout.vue'
import CMediaStreamRenderer from '~/components/CMediaStreamRenderer.vue'

const props = defineProps({
  mediaStream: {
    type: Object as PropType<MediaStream | null>,
    default: null,
  },

  displayName: {
    type: String,
    required: true,
  },
})

const hasVideo = computed(() => {
  return (props.mediaStream?.getVideoTracks()?.length ?? 0) > 0
})
</script>

<template>
  <CMediaStreamRenderer v-if="mediaStream && hasVideo" :media-stream />

  <CCallParticipantLayout v-else :display-name />
</template>
