import { io, type Socket } from 'socket.io-client'
import {
  computed,
  markRaw,
  onBeforeMount,
  onBeforeUnmount,
  ref,
  toValue,
  watch,
  type Ref,
} from 'vue'
import { useLogger } from '~/composables/logger.composable'
import { useSocketStore } from '~/store/socket.store'

function useSocketCreate() {
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
    socket: socketRef as Ref<Socket>,
    connect,
  }
}

export function useSocketInit() {
  const store = useSocketStore()
  const { connect, socket } = useSocketCreate()

  onBeforeMount(() => {
    connect()
  })

  watch(socket, (socket) => {
    if (!socket) {
      store.socket = null
      return
    }

    store.socket = markRaw(socket)
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
  handler: (...args: unknown[]) => void | Promise<void>,
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
    const vSocket = toValue(socket)
    if (vSocket) {
      vSocket.off(event, handler)
    }
  })
}
