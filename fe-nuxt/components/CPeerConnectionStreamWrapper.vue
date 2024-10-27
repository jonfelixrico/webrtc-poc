<script setup lang="ts">
import { markRaw, onBeforeUnmount, ref, watch, type PropType } from 'vue'

const props = defineProps({
  connection: {
    type: Object as PropType<RTCPeerConnection>,
    required: true,
  },
})

const mediaStream = ref<MediaStream | null>(null)
function setMediaStream(stream: MediaStream | null) {
  if (!stream) {
    mediaStream.value = null
    return
  }

  mediaStream.value = markRaw(stream)
}

function handleTrackEvt(event: RTCTrackEvent) {
  if (!event.streams?.length) {
    setMediaStream(null)
    return
  }

  const [stream] = event.streams
  setMediaStream(stream)
}

watch(
  () => props.connection,
  (newConn, oldConn) => {
    if (oldConn) {
      oldConn.removeEventListener('track', handleTrackEvt)
    } else if (!oldConn && newConn) {
      const receivers = newConn.getReceivers()
      if (receivers.length) {
        setMediaStream(new MediaStream(receivers.map((r) => r.track)))
      }
    }

    newConn.addEventListener('track', handleTrackEvt)
  },
  {
    immediate: true,
  },
)

onBeforeUnmount(() => {
  if (!props.connection) {
    return
  }

  props.connection.removeEventListener('track', handleTrackEvt)
})
</script>

<template>
  <slot :mediaStream />
</template>
