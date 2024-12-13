import { Room, RoomUser } from '@webrtcpoc/common'
import { Expose, Type } from 'class-transformer'

export class RoomUserDto implements RoomUser {
  @Expose() id: string
  @Expose() name: string
}

export class RoomDto implements Room {
  @Expose() id: string

  @Type(() => RoomUserDto)
  @Expose()
  users: RoomUserDto[]

  @Expose() name: string
}
