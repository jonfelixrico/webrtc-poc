<script setup lang="ts">
import type { PropType } from 'vue'
import {
  onSocketEvent,
  useSocketFromStore,
} from '~/composables/socket-v2.composable'
import { useLogger } from '~/composables/logger.composable'
import { ICE_SERVERS } from '~/typings/ice-servers.const'
import { computed, makeConnectionReactive, toValue } from '#imports'
import { useWebRtcStore } from '~/store/web-rtc.store'

const props = defineProps({
  peerConnection: {
    type: Object as PropType<RTCPeerConnection>,
    required: true,
  },

  peerClientId: {
    type: String,
    required: true,
  },
})

const logger = useLogger()
const store = useWebRtcStore()

const socket = useSocketFromStore()

const connObj = computed({
  get: () => store.$state.connections[props.peerClientId],

  set: (val) => {
    store.$state.connections[props.peerClientId] = val
  },
})

onSocketEvent(
  'offer_accepted',

  ({
    clientId,
    rtcSession,
  }: {
    clientId: string
    rtcSession: RTCSessionDescriptionInit
    roomId: string
  }) => {
    const { peerConnection } = props

    peerConnection.setRemoteDescription(new RTCSessionDescription(rtcSession))
    logger.info('Completed handshake with client %s', clientId)
  },
)

onSocketEvent(
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
    logger.info('Received offer from client %s', clientId)

    const conn = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
      iceTransportPolicy: 'relay',
    })
    const reactiveConn = makeConnectionReactive(conn)
    connObj.value = reactiveConn

    await conn.setRemoteDescription(new RTCSessionDescription(rtcSession))
    const answer = await conn.createAnswer()
    await conn.setLocalDescription(answer)

    toValue(socket).emit('accept_offer', {
      roomId,
      rtcSession: answer,
      clientId,
    })

    logger.info('Sent offer acceptance to client %s', clientId)
  },
)

onSocketEvent(
  'ice_candidate_sent',
  async ({
    clientId,
    iceCandidate,
  }: {
    clientId: string
    iceCandidate: RTCIceCandidateInit
    roomId: string
  }) => {
    const { peerConnection } = props

    logger.debug('Incoming ice candidate from client %s...', clientId)
    try {
      await peerConnection.addIceCandidate(iceCandidate)
      logger.info('Added ice candidate from client %s', clientId)
    } catch (e) {
      logger.warn('Failed adding ice candidate from client %s', clientId)
    }
  },
)
</script>
