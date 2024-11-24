import { Expose, Type } from 'class-transformer'
import { IRoom, IRoomUser } from 'src/room/room.class'

export class RoomUserDto implements IRoomUser {
  @Expose() id: string
  @Expose() name: string
}

export class RoomDto implements IRoom {
  @Type(() => RoomUserDto)
  @Expose()
  users: RoomUserDto[]

  @Expose() name: string
}
