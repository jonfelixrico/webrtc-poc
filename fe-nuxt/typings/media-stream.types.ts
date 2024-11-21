import type { MaybeNullish } from '~/typings/util.types'

export interface TrackState {
  enabled: boolean
  id: MaybeNullish<string>
}
