import { useLogger } from '~/composables/logger.composable'
import { io, type Socket } from 'socket.io-client'
import { computed, markRaw, onBeforeMount, onBeforeUnmount, watch } from 'vue'
import { useSocketStore } from '~/store/socket.store'

export function useSocketInit(roomId: string) {
  const store = useSocketStore()
  const logger = useLogger()

  function connect() {
    const socket = io({
      /*
       * Adding /be to the URL above doesn't work. Looks like it only accepts
       * protocol + host, so we're specifying /be here.
       *
       * /be is our proxy for the backend, where the socket.io server is at.
       */
      path: `/be/socket.io/room-${roomId}`,
      autoConnect: false,
    })

    socket.once('connect', () => {
      logger.info('Your client id is %s', socket.id)
      store.socket = markRaw(socket)
    })

    socket.connect()
  }

  onBeforeMount(() => {
    connect()
  })
}

export function useSocketFromStore() {
  const store = useSocketStore()

  return computed(() => store.socket as Socket)
}

export function onSocketAvailable(
  handler: (socket: Socket) => Promise<void> | void,
) {
  const socket = useSocketFromStore()

  watch(
    socket,
    (socket) => {
      if (!socket) {
        return
      }

      handler(socket)
    },
    {
      immediate: true,
    },
  )
}

export function onSocketEvent(
  event: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (...args: any[]) => void | Promise<void>,
) {
  const socket = useSocketFromStore()

  watch(
    socket,
    (nSocket, oSocket) => {
      if (nSocket) {
        nSocket.on(event, handler)
      }

      if (oSocket) {
        oSocket.off(event, handler)
      }
    },
    {
      immediate: true,
    },
  )

  onBeforeUnmount(() => {
    if (socket.value) {
      socket.value.off(event, handler)
    }
  })
}
