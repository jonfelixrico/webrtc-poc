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

  return reactive({
    connectionState,
    iceGatheringState,
    connection: markRaw(conn),
  })
}
