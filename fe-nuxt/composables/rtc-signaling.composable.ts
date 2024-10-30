import type { Socket } from 'socket.io-client'
import { markRaw, toValue, type MaybeRef } from 'vue'
import { useLogger } from '~/composables/logger.composable'
import {
  onAppSocketConnect,
  type AppSocket,
} from '~/composables/socket.composable'
import { useWebRtcStore } from '~/store/web-rtc.store'
import { makeConnectionReactive } from '~/utils/rtc.util'

const ICE_SERVERS: RTCIceServer[] = [
  {
    urls: 'turn:coturn.jfrapps.com:3478',
    username: 'turn',
    credential: 'turn',
  },
]

export function useRtcJoinHandler(
  appSocket: AppSocket | null,
  roomId: MaybeRef<string>,
) {
  const store = useWebRtcStore()
  const logger = useLogger()

  async function sendOffer(clientId: string, socket: Socket) {
    const conn = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
      iceTransportPolicy: 'relay',
    })

    store.$state.connections[clientId] = makeConnectionReactive(conn)

    const offer = await conn.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: false,
    })
    await conn.setLocalDescription(offer)
    socket.emit('send_offer', {
      clientId,
      rtcSession: offer,
    })

    logger.debug('Sent an offer to client %s', clientId)
  }

  onAppSocketConnect(appSocket, (sock) => {
    const rid = toValue(roomId)
    sock.emit('join', {
      roomId: rid,
    })
    logger.debug('Emitted join to room %s', rid)

    sock.once('user_list_synced', (payload: { clientIds: string[] }) => {
      logger.debug(
        'Received initial user list. %s users',
        payload.clientIds.length,
      )

      payload.clientIds
        .filter((id) => id !== sock.id)
        .forEach((id) => sendOffer(id, sock))
    })
  })
}

export function useRtcOfferListener(appSocket: AppSocket | null) {
  const store = useWebRtcStore()
  const logger = useLogger()

  onAppSocketConnect(appSocket, (socket) => {
    socket.on(
      'offer_accepted',
      ({
        clientId,
        rtcSession,
        roomId,
      }: {
        clientId: string
        rtcSession: RTCSessionDescriptionInit
        roomId: string
      }) => {
        const conn = store.$state.connections[clientId]?.connection
        if (!conn) {
          logger.warn('Received ack from %s but no conn was found', clientId)
          return
        }

        conn.addEventListener('icecandidate', (event) => {
          logger.debug('Sent ice candidate to client %s', clientId)
          socket.emit('send_ice_candidate', {
            clientId,
            roomId,
            iceCandidate: event.candidate,
          })
        })

        store.$state.connections[clientId] = makeConnectionReactive(conn)

        conn.setRemoteDescription(new RTCSessionDescription(rtcSession))
        logger.info('Completed handshake with client %s', clientId)
      },
    )

    socket.on(
      'offer_sent',
      async ({
        clientId,
        rtcSession,
        roomId,
      }: {
        clientId: string
        rtcSession: RTCSessionDescriptionInit
        roomId: string
      }) => {
        if (store.$state.connections[clientId]) {
          logger.warn(
            'Received offer from client %s but a conn already exists',
            clientId,
          )
          return
        }

        logger.info('Received offer from client %s', clientId)

        const conn = new RTCPeerConnection({
          iceServers: ICE_SERVERS,
          iceTransportPolicy: 'relay',
        })
        store.$state.connections[clientId] = makeConnectionReactive(conn)

        await conn.setRemoteDescription(new RTCSessionDescription(rtcSession))
        const answer = await conn.createAnswer()
        await conn.setLocalDescription(answer)

        socket.emit('accept_offer', {
          roomId,
          rtcSession: answer,
          clientId,
        })

        logger.info('Sent offer acceptance to client %s', clientId)
      },
    )

    socket.on(
      'ice_candidate_sent',
      async ({
        clientId,
        iceCandidate,
      }: {
        clientId: string
        iceCandidate: RTCIceCandidateInit
        roomId: string
      }) => {
        const conn = store.$state.connections[clientId]?.connection
        if (!conn) {
          logger.warn(
            'Received ice candidate from client %s but no connection was found',
            clientId,
          )
        }

        logger.debug('Incoming ice candidate from client %s...', clientId)
        try {
          await conn.addIceCandidate(iceCandidate)
          logger.info('Added ice candidate from client %s', clientId)
        } catch (e) {
          logger.warn('Failed adding ice candidate from client %s', clientId)
        }
      },
    )
  })
}
