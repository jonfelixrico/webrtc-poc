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

  return reactive({
    connectionState,
    connection: markRaw(conn),
  })
}
