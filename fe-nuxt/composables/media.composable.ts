import { useUserMedia } from '#imports'
import { computed, toValue, type MaybeRef } from 'vue'
import type { MaybeNullish } from '~/typings/util.types'

export function useHasVideo(mediaStream: MaybeRef<MaybeNullish<MediaStream>>) {
  return computed(
    () => (toValue(mediaStream)?.getVideoTracks()?.length ?? 0) > 0,
  )
}

export function useUserMediaStream(deviceIds: {
  audio?: MaybeNullish<string>
  video?: MaybeNullish<string>
}) {
  const constraints = computed<MediaStreamConstraints>(() => {
    const value: MediaStreamConstraints = {}

    if (deviceIds.audio) {
      value.audio = {
        deviceId: deviceIds.audio,
      }
    }

    if (deviceIds.video) {
      value.video = {
        deviceId: deviceIds.video,
      }
    }

    return value
  })

  const enabled = computed(() => Boolean(deviceIds.audio || deviceIds.video))

  const { stream } = useUserMedia({
    enabled,
    constraints,
    autoSwitch: true,
  })

  return stream
}
