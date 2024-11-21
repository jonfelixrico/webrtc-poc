import { useUserMedia } from '#imports'
import { computed, toValue, type MaybeRef } from 'vue'
import type { TrackState } from '~/typings/media-stream.types'
import type { MaybeNullish } from '~/typings/util.types'

export function useHasVideo(mediaStream: MaybeRef<MaybeNullish<MediaStream>>) {
  return computed(
    () => (toValue(mediaStream)?.getVideoTracks()?.length ?? 0) > 0,
  )
}

export interface DeviceStates {
  audio?: MaybeNullish<TrackState>
  video?: MaybeNullish<TrackState>
}

export function useUserMediaStream(state: DeviceStates) {
  const audioEnabled = computed(() => {
    const { enabled, id } = state?.audio ?? {}
    return Boolean(enabled && id)
  })

  const videoEnabled = computed(() => {
    const { enabled, id } = state?.video ?? {}
    return Boolean(enabled && id)
  })

  const constraints = computed<MediaStreamConstraints>(() => {
    const value: MediaStreamConstraints = {}

    if (audioEnabled.value) {
      value.audio = {
        deviceId: state?.audio?.id as string,
      }
    }

    if (videoEnabled.value) {
      value.video = {
        deviceId: state?.video?.id as string,
      }
    }

    return value
  })

  const enabled = computed(() => audioEnabled.value || videoEnabled.value)

  const { stream } = useUserMedia({
    enabled,
    constraints,
    autoSwitch: true,
  })

  return stream
}
