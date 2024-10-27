import { Module } from '@nestjs/common'
import { RoomService } from './room.service/room.service'

@Module({
  providers: [RoomService],
})
export class RoomModule {}
