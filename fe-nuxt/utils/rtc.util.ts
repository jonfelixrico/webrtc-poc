import { markRaw, reactive, readonly, ref } from 'vue'

export function makeConnectionReactive(conn: RTCPeerConnection) {
  const isConnected = ref(false)

  function handleStateChange() {
    isConnected.value = conn.connectionState === 'connected'

    if (conn.connectionState === 'closed') {
      conn.removeEventListener('connectionstatechange', handleStateChange)
    }
  }
  conn.addEventListener('connectionstatechange', handleStateChange)

  return reactive({
    isConnected: readonly(isConnected),
    connection: markRaw(conn),
  })
}
