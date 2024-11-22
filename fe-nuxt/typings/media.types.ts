import type { MaybeNullish } from '~/typings/util.types'

export interface DeviceState {
  enabled: boolean
  id: MaybeNullish<string>
}
