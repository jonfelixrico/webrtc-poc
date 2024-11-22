import { useUserMedia } from '#imports'
import { useLocalStorage } from '@vueuse/core'
import { computed, reactive, toValue, type MaybeRef } from 'vue'
import type { DeviceState } from '~/typings/media.types'
import type { MaybeNullish } from '~/typings/util.types'

export function useHasVideo(mediaStream: MaybeRef<MaybeNullish<MediaStream>>) {
  return computed(
    () => (toValue(mediaStream)?.getVideoTracks()?.length ?? 0) > 0,
  )
}

export interface DeviceStates {
  audio?: MaybeNullish<DeviceState>
  video?: MaybeNullish<DeviceState>
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

export function usePersistedDeviceConfig() {
  const audioId = useLocalStorage('audioId', null)
  const audioEnabled = useLocalStorage('audioEnabled', false)
  const videoId = useLocalStorage('videoId', null)
  const videoEnabled = useLocalStorage('videoEnabled', false)

  return reactive({
    audio: {
      id: audioId,
      enabled: audioEnabled,
    },

    video: {
      id: videoId,
      enabled: videoEnabled,
    },
  })
}
