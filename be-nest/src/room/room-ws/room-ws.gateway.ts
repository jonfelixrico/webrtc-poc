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
import {
  RoomWsCommandPayloadMap,
  RoomWsEventPayloadMap,
} from '@webrtcpoc/common'
import { URL } from 'url'

const ROOM_REGEXP = /room-(.+)/

function getRoomId(socket: Socket) {
  const urlString = socket.request.url
  if (!urlString) {
    return null
  }

  const urlObj = new URL(urlString)
  return ROOM_REGEXP.exec(urlObj.pathname)?.[1] ?? null
}

@WebSocketGateway(ROOM_REGEXP)
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
    const formerMemberships: string[] = []

    for (const roomId in this.roomMembers) {
      const set = this.roomMembers[roomId]

      if (!set.has(socket.id)) {
        continue
      }

      formerMemberships.push(roomId)
      set.delete(socket.id)
    }

    return formerMemberships
  }

  handleDisconnect(client: Socket) {
    this.logger.debug('Client has disconnected', client.id)
    const formerRooms = this.purgeMemberships(client)

    for (const roomId of formerRooms) {
      this.syncUserList(roomId)
    }
  }

  handleConnection(socket: Socket) {
    this.logger.debug('Client has established connection', socket.id)

    const roomId = getRoomId(socket)
    this.addMember(roomId, socket)

    socket.broadcast // broadcast to all room members except this one
      .to(roomId)
      .emit('user_joined', {
        clientId: socket.id,
      } as RoomWsEventPayloadMap['user_joined'])

    this.syncUserList(roomId)
  }

  @WebSocketServer()
  private server: Server

  private syncUserList(roomId: string) {
    this.server.of(`/room-${roomId}`).emit('user_list_synced', {
      clientIds: this.getMembers(roomId),
    } as RoomWsEventPayloadMap['user_list_synced'])
  }

  @SubscribeMessage('send_description')
  async handleSendDescription(
    @MessageBody()
    payload: RoomWsCommandPayloadMap['send_description'],
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(payload.toClientId).emit('description_sent', {
      fromClientId: socket.id,
      description: payload.description,
    } as RoomWsEventPayloadMap['description_sent'])
  }

  @SubscribeMessage('send_candidate')
  async handleSendCandidate(
    @MessageBody()
    payload: RoomWsCommandPayloadMap['send_candidate'],
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(payload.toClientId).emit('candidate_sent', {
      fromClientId: socket.id,
      candidate: payload.candidate,
    } as RoomWsEventPayloadMap['candidate_sent'])
  }
}
