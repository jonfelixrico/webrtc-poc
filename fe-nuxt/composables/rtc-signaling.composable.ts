import type { Socket } from 'socket.io-client'
import { markRaw, toValue, type MaybeRef } from 'vue'
import { useLogger } from '~/composables/logger.composable'
import {
  onAppSocketConnect,
  type AppSocket,
} from '~/composables/socket.composable'
import { useWebRtcStore } from '~/store/web-rtc.store'

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun.l.google.com:5349' },
  { urls: 'stun:stun1.l.google.com:3478' },
  { urls: 'stun:stun1.l.google.com:5349' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:5349' },
  { urls: 'stun:stun3.l.google.com:3478' },
  { urls: 'stun:stun3.l.google.com:5349' },
  { urls: 'stun:stun4.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:5349' },
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
    })

    const offer = await conn.createOffer()
    await conn.setLocalDescription(offer)

    socket.emit('send_offer', {
      clientId,
      rtcSession: offer,
    })

    store.$state.peerConnections[clientId] = markRaw(conn)

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

  onAppSocketConnect(appSocket, (sock) => {
    sock.on(
      'offer_accepted',
      ({
        clientId,
        rtcSession,
      }: {
        clientId: string
        rtcSession: RTCSessionDescriptionInit
      }) => {
        const conn = store.$state.peerConnections[clientId]
        if (!conn) {
          logger.warn('Received ack from %s but no conn was found', clientId)
          return
        }

        conn.setRemoteDescription(rtcSession)
        logger.info('Completed handshake with client %s', clientId)
      },
    )

    sock.on(
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
        if (store.$state.peerConnections[clientId]) {
          logger.warn(
            'Received offer from client %s but a conn already exists',
            clientId,
          )
          return
        }

        logger.info('Received offer from client %s', clientId)

        const conn = new RTCPeerConnection({
          iceServers: ICE_SERVERS,
        })

        await conn.setRemoteDescription(rtcSession)
        const answer = await conn.createAnswer()
        await conn.setLocalDescription(answer)

        store.$state.peerConnections[clientId] = conn
        sock.emit('accept_offer', {
          roomId,
          rtcSession: answer,
          clientId,
        })

        logger.info('Sent offer acceptance to client %s', clientId)
      },
    )
  })
}
