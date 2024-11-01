import { Module } from '@nestjs/common'
import { RoomService } from './room.service/room.service'
import { RoomWsGateway } from './room-ws/room-ws.gateway'
import { RoomController } from './room.controller'

@Module({
  providers: [RoomService, RoomWsGateway],
  controllers: [RoomController],
})
export class RoomModule {}
