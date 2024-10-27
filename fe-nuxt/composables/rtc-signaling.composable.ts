import type { Socket } from 'socket.io-client'
import { markRaw, toValue, type MaybeRef } from 'vue'
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
  }

  onAppSocketConnect(appSocket, (sock) => {
    sock.emit('join', {
      roomdId: toValue(roomId),
    })

    sock.once('user_list_synced', (payload: { clientIds: string[] }) => {
      payload.clientIds
        .filter((id) => id !== sock.id)
        .forEach((id) => sendOffer(id, sock))
    })
  })
}

export function useRtcOfferListener(appSocket: AppSocket | null) {
  onAppSocketConnect(appSocket, (sock) => {})
}
