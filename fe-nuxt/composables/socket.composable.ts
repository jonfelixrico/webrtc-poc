import { io, type Socket } from 'socket.io-client'
import { markRaw, onBeforeMount, reactive, readonly, ref, watch } from 'vue'

export interface AppSocket {
  socket: Socket
  connected: boolean
}

export function useSocket(): AppSocket | undefined {
  if (!import.meta.client) {
    return
  }

  const socket = io(`ws://${window.location.host}`, {
    /*
     * Adding /be to the URL above doesn't work. Looks like it only accepts
     * protocol + host, so we're specifying /be here.
     *
     * /be is our proxy for the backend, where the socket.io server is at.
     */
    path: '/be/socket.io',
    autoConnect: false,
  })

  const connected = ref(socket.connected)
  socket.once('connect', () => {
    connected.value = true
  })

  onBeforeMount(() => {
    socket.connect()
  })

  return reactive({
    socket: markRaw(socket),
    connected: readonly(connected),
  })
}

export function onAppSocketConnect(
  appSocket: AppSocket,
  handler: (socket: Socket) => void,
) {
  watch(
    appSocket,
    (appSock) => {
      if (!appSock?.connected) {
        return
      }

      handler(appSock.socket)
    },
    {
      deep: true,
      immediate: true,
    },
  )
}
