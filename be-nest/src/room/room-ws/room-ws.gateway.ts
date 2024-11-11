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

function getRoomId(socket: Socket) {
  const urlString = socket.request.url
  if (!urlString) {
    return null
  }

  const ID_EXTRACT_REGEXP = /\/room-([^/]+)/
  return ID_EXTRACT_REGEXP.exec(urlString)?.[1] ?? null
}

@WebSocketGateway(/^room-(.+)/)
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

  handleDisconnect(client: Socket) {
    const roomId = getRoomId(client)

    this.logger.debug('Client has disconnected', [client.id, roomId].join('/'))

    const set = this.roomMembers[roomId]
    set.delete(client.id)

    this.broadcastUserList(roomId)
  }

  handleConnection(socket: Socket) {
    const roomId = getRoomId(socket)

    this.logger.debug(
      'Client has established connection',
      [socket.id, roomId].join('/'),
    )

    this.addMember(roomId, socket)

    socket.broadcast // broadcast to entire namespace except this one
      .emit('user_joined', {
        clientId: socket.id,
      } as RoomWsEventPayloadMap['user_joined'])

    this.broadcastUserList(roomId)
  }

  @WebSocketServer()
  private server: Server

  private broadcastUserList(roomId: string) {
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

  @SubscribeMessage('sync_user_list')
  handleSyncUserList(@ConnectedSocket() socket: Socket) {
    const roomId = getRoomId(socket)
    const users = this.getMembers(roomId).map((id) => {
      return {
        id,
      }
    })

    socket.emit('user_list_synced', {
      users,
    } as RoomWsEventPayloadMap['user_list_synced'])

    this.logger.debug('sync_user_list', roomId)
  }
}
