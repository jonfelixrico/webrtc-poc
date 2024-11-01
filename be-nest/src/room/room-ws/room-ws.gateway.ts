import { Logger } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, type Socket } from 'socket.io'

@WebSocketGateway()
export class RoomWsGateway implements OnGatewayDisconnect, OnGatewayConnection {
  constructor(private logger: Logger) {}

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
  private purgeMemberships(socket: Socket) {
    for (const roomId in this.roomMembers) {
      const set = this.roomMembers[roomId]
      set.delete(socket.id)
    }
  }

  handleDisconnect(client: Socket) {
    this.purgeMemberships(client)
    this.logger.debug('Client %s has disconnected', client.id)
  }

  handleConnection(client: Socket) {
    this.logger.debug('Client % has established connection', client.id)
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

  @SubscribeMessage('send_description')
  async handleSendDescription(
    @MessageBody()
    payload: {
      toClientId: string
      description: RTCSessionDescription
    },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(payload.toClientId).emit('description_sent', {
      fromClientId: socket.id,
      description: payload.description,
    })
  }

  @SubscribeMessage('send_candidate')
  async handleSendCandidate(
    @MessageBody()
    payload: {
      toClientId: string
      candidate: RTCIceCandidate
    },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(payload.toClientId).emit('candidate_sent', {
      fromClientId: socket.id,
      candidate: payload.candidate,
    })
  }
}
