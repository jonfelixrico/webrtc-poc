import { markRaw, reactive, ref } from 'vue'

export function makeConnectionReactive(conn: RTCPeerConnection) {
  const connectionState = ref<RTCPeerConnection['connectionState']>('new')

  function handleStateChange() {
    const state = conn.connectionState
    connectionState.value = state

    if (state === 'closed') {
      conn.removeEventListener('connectionstatechange', handleStateChange)
    }
  }
  conn.addEventListener('connectionstatechange', handleStateChange)

  const iceGatheringState = ref<RTCPeerConnection['iceGatheringState']>('new')

  function handleIceGatheringStateChange() {
    const state = conn.iceGatheringState
    iceGatheringState.value = state

    if (state === 'complete') {
      conn.removeEventListener(
        'icegatheringstatechange',
        handleIceGatheringStateChange,
      )
    }
  }
  conn.addEventListener(
    'icegatheringstatechange',
    handleIceGatheringStateChange,
  )

  const iceCandidates = ref<RTCIceCandidate[]>([])
  conn.addEventListener('icecandidate', ({ candidate }) => {
    if (!candidate) {
      return
    }

    console.log('Found candidate %s', candidate.foundation)

    iceCandidates.value.push(markRaw(candidate))
  })

  return reactive({
    connectionState,
    iceGatheringState,
    connection: markRaw(conn),
    iceCandidates,
  })
}
