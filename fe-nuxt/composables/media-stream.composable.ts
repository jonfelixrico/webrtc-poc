import { computed, toValue, type MaybeRef } from 'vue'

export function useHasVideo(mediaStream: MaybeRef<MediaStream>) {
  return computed(
    () => (toValue(mediaStream)?.getVideoTracks()?.length ?? 0) > 0,
  )
}
