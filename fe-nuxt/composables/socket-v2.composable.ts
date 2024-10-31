import { io, type Socket } from 'socket.io-client'
import { markRaw, ref } from 'vue'
import { useLogger } from '~/composables/logger.composable'

export function useSocketCreate() {
  const logger = useLogger()
  const socketRef = ref<Socket | null>(null)

  function connect() {
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

    socket.once('connect', () => {
      logger.info('Your client id is %s', socket.id)
      socketRef.value = markRaw(socket)
    })

    socket.connect()
  }

  return {
    socket: socketRef,
    connect,
  }
}
