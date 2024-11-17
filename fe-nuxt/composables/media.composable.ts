import { computed, toValue, type MaybeRef } from 'vue'
import type { MaybeNullish } from '~/typings/util.types'

export function useHasVideo(mediaStream: MaybeRef<MaybeNullish<MediaStream>>) {
  return computed(
    () => (toValue(mediaStream)?.getVideoTracks()?.length ?? 0) > 0,
  )
}
