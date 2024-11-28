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

export function useHasAudio(mediaStream: MaybeRef<MaybeNullish<MediaStream>>) {
  return computed(
    () => (toValue(mediaStream)?.getAudioTracks()?.length ?? 0) > 0,
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

interface DeviceLists {
  video: MaybeRef<MediaDeviceInfo[]>
  audio: MaybeRef<MediaDeviceInfo[]>
}

export function usePersistedDeviceConfig(devices: DeviceLists) {
  const audioId = useLocalStorage('audioId', null)
  const audioEnabled = useLocalStorage('audioEnabled', false)
  const videoId = useLocalStorage('videoId', null)
  const videoEnabled = useLocalStorage('videoEnabled', false)

  const audioDevices = computed(
    () => new Set(toValue(devices.audio).map((device) => device.deviceId)),
  )
  const videoDevices = computed(
    () => new Set(toValue(devices.video).map((device) => device.deviceId)),
  )

  const safeAudioEnabled = computed({
    get: () =>
      audioEnabled.value && audioDevices.value.has(audioId.value ?? ''),
    set: (value) => {
      audioEnabled.value = value
    },
  })
  const safeVideoEnabled = computed({
    get: () =>
      videoEnabled.value && videoDevices.value.has(videoId.value ?? ''),
    set: (value) => {
      videoEnabled.value = value
    },
  })

  return reactive({
    audio: {
      id: audioId,
      enabled: safeAudioEnabled,
    },

    video: {
      id: videoId,
      enabled: safeVideoEnabled,
    },
  })
}
