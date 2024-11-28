<script setup lang="ts">
import type { RoomUser } from '@webrtcpoc/common'
import { toRef, type PropType } from 'vue'
import CCallParticipantLayout from '~/components/CCallParticipantLayout.vue'
import CMediaStreamRendererVideo from '~/components/media-stream/CMediaStreamRendererVideo.vue'
import { useHasVideo } from '~/composables/media.composable'

const props = defineProps({
  mediaStream: {
    type: Object as PropType<MediaStream | null>,
    default: null,
  },

  user: {
    type: Object as PropType<RoomUser>,
    required: true,
  },
})

const hasVideo = useHasVideo(toRef(props, 'mediaStream'))
</script>

<template>
  <!--
    This needs to be keyed so that a new component instance will be made each
    time `mediaStream` reference got changed, as per the advise of the component
    itself.
  -->
  <CMediaStreamRendererVideo
    v-if="mediaStream && hasVideo"
    :key="mediaStream.id"
    :media-stream
  />

  <CCallParticipantLayout v-else :display-name="user.name" />
</template>
