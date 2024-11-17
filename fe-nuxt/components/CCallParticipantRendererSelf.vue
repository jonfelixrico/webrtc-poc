<script setup lang="ts">
import { toRef, type PropType } from 'vue'
import CCallParticipantLayout from '~/components/CCallParticipantLayout.vue'
import CMediaStreamRendererVideo from '~/components/media-stream/CMediaStreamRendererVideo.vue'
import { useHasVideo } from '~/composables/media-stream.composable'

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

const hasVideo = useHasVideo(toRef(props, 'mediaStream'))
</script>

<template>
  <CMediaStreamRendererVideo
    v-if="mediaStream && hasVideo"
    :media-stream
    mute-audio
  />

  <CCallParticipantLayout v-else :display-name />
</template>
