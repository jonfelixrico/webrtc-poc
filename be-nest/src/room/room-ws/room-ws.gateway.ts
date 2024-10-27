import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, type Socket } from 'socket.io'

@WebSocketGateway()
export class RoomWsGateway {
  private roomMembers: Record<string, Set<string>> = {}
  private getMembers(roomId: string) {
    return Array.from(this.roomMembers[roomId] ?? [])
  }
  private addMember(roomId: string, socket: Socket) {
    let roomObj = this.roomMembers[roomId]
    if (!roomObj) {
      roomObj = new Set()
      this.roomMembers[roomId] = roomObj
    }

    roomObj.add(socket.id)
  }

  @WebSocketServer()
  private server: Server

  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomId }: { roomId: string },
  ) {
    await socket.join(roomId)
    this.addMember(roomId, socket)

    socket.broadcast // broadcast to all room members except this one
      .to(roomId)
      .emit('user_joined', { clientId: socket.id, roomId })
    // broadcast to all room members, including this one
    this.server.to(roomId).emit('user_list_synced', {
      clientIds: this.getMembers(roomId),
      roomId,
    })
  }

  @SubscribeMessage('send_offer')
  async handleSendOffer(
    @MessageBody()
    {
      clientId,
      roomId,
      rtcSession,
    }: {
      roomId: string
      clientId: string
      rtcSession: Record<string, unknown>
    },
    @ConnectedSocket() socket: Socket,
  ) {
    // TODO add checking to see if client really is part of the room

    socket.to(clientId).emit('offer_sent', {
      clientId: socket.id,
      rtcSession,
      roomId,
    })
  }

  @SubscribeMessage('accept_offer')
  async handleAcceptOffer(
    @MessageBody()
    {
      clientId,
      roomId,
      rtcSession,
    }: {
      roomId: string
      clientId: string
      rtcSession: Record<string, unknown>
    },
    @ConnectedSocket() socket: Socket,
  ) {
    // TODO add checking to see if client really is part of the room

    socket.to(clientId).emit('offer_accepted', {
      clientId: socket.id,
      rtcSession,
      roomId,
    })
  }
}
