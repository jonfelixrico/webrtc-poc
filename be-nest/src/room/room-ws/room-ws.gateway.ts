import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'
import { type Socket } from 'socket.io'

@WebSocketGateway()
export class RoomWsGateway {
  @SubscribeMessage('join')
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ) {
    await client.join(payload)
  }
}
