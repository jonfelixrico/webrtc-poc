import {
  type IOffer,
  useSignalingService,
} from '~/composables/signaling.composable'
import { useWebRtcStore } from '~/store/web-rtc.store'
import { onMounted, ref, type Ref, toValue, watch } from 'vue'

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

export function useOutgoingRtc() {
  const svc = useSignalingService()
  const conn = new RTCPeerConnection({
    iceServers: ICE_SERVERS,
  })

  async function call() {
    const offer = await conn.createOffer()

    // TODO impl a way to clean this up
    svc.listenForAnswer(({ rtcOffer }) => {
      conn.setRemoteDescription(rtcOffer)
    })

    await conn.setLocalDescription(offer)
    svc.sendOffer(offer)
  }

  return {
    call,
  }
}

export function useIncomingRtc() {
  const svc = useSignalingService()
  const { $state } = useWebRtcStore()

  async function acceptCall({ rtcOffer, callerId }: IOffer) {
    const conn = new RTCPeerConnection({ iceServers: ICE_SERVERS })
    await conn.setRemoteDescription(new RTCSessionDescription(rtcOffer))

    const answer = await conn.createAnswer()
    await conn.setLocalDescription(answer)
    svc.sendAnswerOffer(answer)

    $state.peerConnections[callerId] = conn

    // TODO add cleanup
    conn.addEventListener('connectionstatechange', () => {
      if (conn.signalingState !== 'closed') {
        return
      }

      // TODO change Date.now() to an actual callerId
      delete $state.peerConnections[callerId]
    })
  }

  onMounted(() => {
    svc.listenForIncomingCalls((offer) => {
      // TODO impl way to accept/decline calls
      acceptCall(offer)
    })
  })
}

export function useMediaStreamFromConnection(
  conn: RTCPeerConnection | Ref<RTCPeerConnection>,
) {
  const mediaStream = ref<MediaStream | null>(null)

  watch(
    () => toValue(conn),
    (conn) => {
      // Get current tracks as of the watcher handler execution

      const receiverTracks = conn
        .getReceivers()
        .map((receiver) => receiver.track)

      if (receiverTracks.length) {
        mediaStream.value = new MediaStream(receiverTracks)
      }

      // This is to allow us to react to any new tracks after the watch executes its handler

      function trackListener(event: RTCTrackEvent) {
        mediaStream.value = event.streams[0] ?? null
      }
      conn.addEventListener('track', trackListener)
      // TODO removeEventListener
    },
    {
      immediate: true,
    },
  )
}
