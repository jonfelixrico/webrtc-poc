import { io, type Socket } from 'socket.io-client'
import {
  markRaw,
  onBeforeMount,
  reactive,
  readonly,
  ref,
  toValue,
  watch,
} from 'vue'
import { useLogger } from '~/composables/logger.composable'

export interface AppSocket {
  socket: Socket
  connected: boolean
}

export function useSocket(): AppSocket | null {
  if (!import.meta.client) {
    return null
  }

  const logger = useLogger()

  const isSecure = window.location.protocol.startsWith('https')
  const socket = io(`${isSecure ? 'wss' : 'ws'}://${window.location.host}`, {
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
    logger.info('Your client id is %s', socket.id)
  })

  onBeforeMount(() => {
    socket.connect()
    logger.debug('Attempted conn for socket.io')
  })

  return reactive({
    socket: markRaw(socket),
    connected: readonly(connected),
  })
}

export function onAppSocketConnect(
  appSocket: AppSocket | null,
  handler: (socket: Socket) => void,
) {
  watch(
    () => toValue(appSocket),
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
